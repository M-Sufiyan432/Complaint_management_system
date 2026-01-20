const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  updateComplaintStatus,
  getComplaintMetrics
} = require('../controllers/complaintController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('complaint_type')
      .isIn(['live_demo', 'billing_issue', 'technical_issue', 'feedback'])
      .withMessage('Invalid complaint type'),
    body('details').isObject().withMessage('Details must be an object'),
    validate
  ],
  createComplaint
);

router.patch(
  '/:id/status',
  authenticate,
  [
    body('status')
      .isIn(['raised', 'in_progress', 'waiting_on_user', 'resolved', 'closed'])
      .withMessage('Invalid status'),
    validate
  ],
  updateComplaintStatus
);

router.get('/:id/metrics', authenticate, getComplaintMetrics);

module.exports = router;