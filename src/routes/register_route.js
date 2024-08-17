"use strict";

const router = require("express").Router();
const { renderRegister } = require("../controllers/register_controller");

router.get("/", renderRegister);

module.exports = router;
