"use strict";

const express = require("express");
const path = require("path");
require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo");

const rateLimiter = require("./src/middlewares/rate_limiter_middleware");
const cors = require("cors");

const compression = require("compression");
const minify = require("express-minify");

const { connectDB, disconnectDB } = require("./src/config/mongoose_config");

// Initialize express
const app = express();

// Security middlewares
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(rateLimiter);
}

// Compression and static files
app.use(compression());
app.use(minify());
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to ejs and the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Body parsing and sessions
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true }));

// Instance for session storage
const store = new MongoStore({
  mongoUrl: process.env.MONGO_CONNECTION_URI,
  collectionName: "sessions",
  dbName: "inktale",
});

// Initialize express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store,
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE),
    },
  })
);

app.use("/register", require("./src/routes/register_route"));
app.use("/login", require("./src/routes/login_route"));
app.use("/", require("./src/routes/home_route"));
app.use("/logout", require("./src/routes/logout_route"));

app.use("/blogs", require("./src/routes/blog_detail_route"));

app.use("/profile", require("./src/routes/profile_route"));

/**
 * Middleware to check if the user is authenticated
 * before allowing access to certain routes
 */
app.use(require("./src/middlewares/user_auth_middleware"));

app.use("/create-blog", require("./src/routes/create_blog_route"));

app.use("/reading-list", require("./src/routes/reading_list_route"));

app.use(
  "/blogs",
  require("./src/routes/blog_update_route"),
  require("./src/routes/delete_blog_route")
);

app.use("/dashboard", require("./src/routes/dashboard_route"));

app.use("/settings", require("./src/routes/settings_route"));

// Error-handling middleware (should be the last middleware)
app.use(require("./src/middlewares/error_middleware"));

/**
 * Start the server
 */

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await connectDB(process.env.MONGO_CONNECTION_URI);
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("close", async () => await disconnectDB());
