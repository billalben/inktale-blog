"use strict";

const express = require("express");

const app = express();
const register = require("./src/routes/register_route");

app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));

app.use("/register", register);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
