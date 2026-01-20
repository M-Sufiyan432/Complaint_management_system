const express = require('express');
const { body } = require('express-validator');
const { getUserDetails, updateOnboardingStage } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /users/details:
 *   get:
 *     summary: Get logged-in user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/details', authenticate, getUserDetails);

/**
 * @swagger
 * /users/onboarding-stage:
 *   patch:
 *     summary: Update onboarding stage
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stage]
 *             properties:
 *               stage:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 example: 1
 *     responses:
 *       200:
 *         description: Onboarding stage updated successfully
 *       400:
 *         description: Invalid stage
 */
router.patch(
  '/onboarding-stage',
  authenticate,
  [
    body('stage')
      .isInt({ min: 0, max: 2 })
      .withMessage('Stage must be 0, 1, or 2'),
    validate
  ],
  updateOnboardingStage
);

module.exports = router;
