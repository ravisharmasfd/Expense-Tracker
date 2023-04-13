const express = require("express");
const authMiddleWare = require("../../middleware/auth");
const { createOrder, completeOrder } = require("../../controllers/Order");
const router = express.Router();
router.post("/", authMiddleWare, completeOrder);
router.get("/", authMiddleWare, createOrder);
module.exports = router;
