const express = require('express');
const { body } = require('express-validator');
const { getUserDetails, updateOnboardingStage } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.get('/details', authenticate, getUserDetails);

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