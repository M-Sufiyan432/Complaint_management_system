const express = require('express');
const { getAllComplaints, getAllUsers } = require('../controllers/adminController');
const { updateComplaintStatus } = require('../controllers/complaintController');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const adminRouter = express.Router();

console.log("Admin Routes hit");

adminRouter.get('/complaints', authenticate,authorize('admin'), getAllComplaints);
adminRouter.get('/users', authenticate,authorize('admin'), getAllUsers);

adminRouter.patch(
  '/complaints/:id/status',
  authenticate,
  authorize('admin'),
  body('status').isIn([
    'raised',
    'in_progress',
    'waiting_on_user',
    'resolved',
    'closed',
  ]),
  updateComplaintStatus
);

module.exports = adminRouter;
