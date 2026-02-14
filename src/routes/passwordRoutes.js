const express = require("express");
const {
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/passwordController");
const { forgotPasswordLimiter } = require("../middleware/rateLimiter");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const { body } = require("express-validator");

const router = express.Router();

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
console.log("Password Routes Hit");

router.post(
  "/change-password",
  authenticate,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    validate
  ],
  changePassword
);



module.exports = router;
