"use strict";

const express = require("express");
const path = require("path");
require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo");

const { connectDB, disconnectDB } = require("./src/config/mongoose_config");

const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const home = require("./src/routes/home_route");
const createBlog = require("./src/routes/create_blog_route");
const logout = require("./src/routes/logout_route");
const blogDetail = require("./src/routes/blog_detail_route");
const readingList = require("./src/routes/reading_list_route");
const blogUpdate = require("./src/routes/blog_update_route");
const profile = require("./src/routes/profile_route");
const dashboard = require("./src/routes/dashboard_route");
const deleteBlog = require("./src/routes/delete_blog_route");
const settings = require("./src/routes/settings_route");

const userAuth = require("./src/middlewares/user_auth_middleware");

// Initialize express
const app = express();

// Set the view engine to ejs and the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: "6mb" }));

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

app.use(express.static(path.join(__dirname, "public")));

app.use("/register", register);
app.use("/login", login);
app.use("/", home);
app.use("/logout", logout);

app.use("/blogs", blogDetail);

app.use("/profile", profile);

// Middleware to check if the user is authenticated
app.use(userAuth);

app.use("/create-blog", createBlog);

app.use("/reading-list", readingList);

app.use("/blogs", blogUpdate, deleteBlog);

app.use("/dashboard", dashboard);

app.use("/settings", settings);

/*
 * Start the server
 */

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await connectDB(process.env.MONGO_CONNECTION_URI);

  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("close", async () => await disconnectDB());
