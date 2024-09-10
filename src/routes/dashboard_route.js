"use strict";

const router = require("express").Router();

const renderDashboard = require("../controllers/dashboard_controller");

// GET Route: render dashboard
router.get("/", renderDashboard);

module.exports = router;
