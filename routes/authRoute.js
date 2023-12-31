const express = require("express");
const bodyParser = require("body-parser");
const { registerNewUser, loginUser } = require("../controller/User");

const router = express.Router();

// WARN: All the routes here work for authetication

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/login", loginUser);
router.post("/signup", registerNewUser);

module.exports = router;
