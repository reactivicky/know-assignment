const express = require("express");
const { getUser, updateUser } = require("../controllers/usersController");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

router
  .route("/:id")
  .get(authenticateToken, getUser)
  .put(authenticateToken, updateUser);

module.exports = router;
