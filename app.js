"use strict";

const express = require("express");
require("dotenv").config();

const app = express();
const register = require("./src/routes/register_route");
const { connectDB, disconnectDB } = require("./src/config/mongoose_config");

// Set public directory as the static folder
app.set("view engine", "ejs");

// Parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.use("/register", register);

/*
 * Start the server
 */

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on("close", async () => await disconnectDB());
