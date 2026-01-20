const { ComplaintType, ComplaintStatus } = require('../entities/Complaint');

const validateComplaintDetails = (type, details) => {
  if (!details) {
    return 'Details are required';
  }

  switch (type) {
    case ComplaintType.LIVE_DEMO:
      if (!details.preferred_date) {
        return 'preferred_date is required for live_demo';
      }
      if (!details.preferred_time) {
        return 'preferred_time is required for live_demo';
      }
      if (!details.business_name) {
        return 'business_name is required for live_demo';
      }
      if (!details.contact_number) {
        return 'contact_number is required for live_demo';
      }
      if (!details.demo_type) {
        return 'demo_type is required for live_demo';
      }
      break;

    case ComplaintType.TECHNICAL_ISSUE:
      if (!details.issue_description) {
        return 'issue_description is required for technical_issue';
      }
      break;

    case ComplaintType.BILLING_ISSUE:
      if (!details.invoice_id) {
        return 'invoice_id is required for billing_issue';
      }
      if (!details.amount) {
        return 'amount is required for billing_issue';
      }
      if (!details.currency) {
        return 'currency is required for billing_issue';
      }
      if (!details.issue_reason) {
        return 'issue_reason is required for billing_issue';
      }
      break;

    case ComplaintType.FEEDBACK:
      break;
  }

  return null;
};

const validTransitions = {
  [ComplaintStatus.RAISED]: [ComplaintStatus.IN_PROGRESS, ComplaintStatus.CLOSED],
  [ComplaintStatus.IN_PROGRESS]: [ComplaintStatus.WAITING_ON_USER, ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED],
  [ComplaintStatus.WAITING_ON_USER]: [ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED],
  [ComplaintStatus.RESOLVED]: [ComplaintStatus.CLOSED],
  [ComplaintStatus.CLOSED]: []
};

const isValidStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) {
    return false;
  }
  return validTransitions[currentStatus].includes(newStatus);
};

module.exports = { validateComplaintDetails, isValidStatusTransition };