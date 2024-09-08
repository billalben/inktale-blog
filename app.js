"use strict";

const express = require("express");
require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo");

const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const { connectDB, disconnectDB } = require("./src/config/mongoose_config");
const home = require("./src/routes/home_route");
const createBlog = require("./src/routes/create_blog_route");
const logout = require("./src/routes/logout_route");
const blogDetail = require("./src/routes/blog_detail_route");
const readingList = require('./src/routes/reading_list_route');

const userAuth = require("./src/middlewares/user_auth_middleware");

// Initialize express
const app = express();

// Set the view engine to ejs and the views directory
app.set("view engine", "ejs");
app.set("views", `${__dirname}/src/views`);

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
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE),
    },
  })
);

app.use(express.static(`${__dirname}/public`));

app.use("/register", register);
app.use("/login", login);
app.use("/", home);
app.use("/logout", logout);

app.use('/blogs', blogDetail)

// Middleware to check if the user is authenticated
app.use(userAuth);

app.use("/create-blog", createBlog);

app.use('/reading-list', readingList);

/*
 * Start the server
 */

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on("close", async () => await disconnectDB());
