const {
  signup,
  signin,
  forgotSendEmail,
  resetPassword,
} = require("../../controllers/auth.js");
const express = require("express");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot", forgotSendEmail);
router.post("/reset", resetPassword);
module.exports = router;
