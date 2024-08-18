"use strict";

const express = require("express");
require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo");

const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const { connectDB, disconnectDB } = require("./src/config/mongoose_config");

// Initialize express
const app = express();

// Set public directory as the static folder
app.set("view engine", "ejs");

// Parse url-encoded bodies (as sent by HTML forms)
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

/*
 * Start the server
 */

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on("close", async () => await disconnectDB());
