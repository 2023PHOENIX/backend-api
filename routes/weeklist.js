const express = require("express");
const {
  createWeekList,
  updateWeekList,
  deleteWeekList,
  deleteWeekListTask,
} = require("../controller/weeklist.js");
const bodyParser = require("body-parser");
const {
  authenticateUser,
} = require("../middlewares/authenticationMiddleWare.js");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/create-weeklist", authenticateUser, createWeekList);
router.post(
  "/update-weeklist/:weekListArrayIndex/:weekListObjectIndex",
  authenticateUser,
  updateWeekList,
);
router.delete(
  "/delete-weekList/:weekListArrayIndex",
  authenticateUser,
  deleteWeekList,
);
router.delete(
  "/delete-weekListTask/:weekListArrayIndex/:weekListTaskIndex",
  authenticateUser,
  deleteWeekListTask,
);
module.exports = router;
