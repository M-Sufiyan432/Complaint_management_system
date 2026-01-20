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

/**
 * @swagger
 * /complaints:
 *   post:
 *     summary: Create a complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [complaint_type, details]
 *             properties:
 *               complaint_type:
 *                 type: string
 *                 enum: [live_demo, billing_issue, technical_issue, feedback]
 *                 example: technical_issue
 *               details:
 *                 type: object
 *                 example:
 *                   issue_description: Unable to login
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *       400:
 *         description: Validation error
 */
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

/**
 * @swagger
 * /complaints/{id}/status:
 *   patch:
 *     summary: Update complaint status
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [raised, in_progress, waiting_on_user, resolved, closed]
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 *       400:
 *         description: Invalid status transition
 */
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

/**
 * @swagger
 * /complaints/{id}/metrics:
 *   get:
 *     summary: Get complaint metrics
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Complaint metrics fetched successfully
 *       404:
 *         description: Complaint not found
 */
router.get('/:id/metrics', authenticate, getComplaintMetrics);

module.exports = router;
