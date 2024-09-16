"use strict";

const errorHandling = (error, req, res, next) => {
  console.error(error?.stack);
  res.status(500).render("./pages/error", { message: "Something went wrong!" });
};

module.exports = errorHandling;
