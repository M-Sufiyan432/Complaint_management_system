const express = require("express");
const {
  forgotPassword,
  resetPassword,
  changePassword,
  setPassword,
} = require("../controllers/passwordController");
const { forgotPasswordLimiter } = require("../middleware/rateLimiter");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const { body } = require("express-validator");

const router = express.Router();

/**
 * @swagger
 * /api/v1/password/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);



/**
 * @swagger
 * /api/v1/password/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);
console.log("Password Routes Hit");

/**
 * @swagger
 * /api/v1/password/change-password:
 *   post:
 *     summary: Change password (Authenticated)
 *     tags: [Password]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
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

router.post(
  "/set-password",
  authenticate,
  [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    validate
  ],
  setPassword
)


module.exports = router;
