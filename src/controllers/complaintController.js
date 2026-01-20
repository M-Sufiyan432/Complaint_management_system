const { AppDataSource } = require("../config/database");
const { ComplaintType, ComplaintStatus } = require("../entities/Complaint");

const {validateComplaintDetails,isValidStatusTransition,} = require("../utils/complaintValidation");
const { handleComplaintStatusChange,} = require("../services/notificationService");
const complaintRepository = AppDataSource.getRepository("Complaint");

const createComplaint = async (req, res) => {
  try {
    const { complaint_type, details } = req.body;

    if (!Object.values(ComplaintType).includes(complaint_type)) {
      return res.status(400).json({ error: "Invalid complaint type" });
    }

    const validationError = validateComplaintDetails(complaint_type, details);


    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const complaint = complaintRepository.create({
      user_id: req.userId,
      complaint_type,
      details,
      status: ComplaintStatus.RAISED,
      status_updated_at: new Date(),
    });

    await complaintRepository.save(complaint);

    res.status(201).json({
      message: "Complaint has been created successfully",
      complaint: {
        id: complaint.id,
        complaint_type: complaint.complaint_type,
        status: complaint.status,
        created_at: complaint.created_at,
      },
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ error: "Failed to create complaint" });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("updated Complain id",id);
    
    const { status } = req.body;

    if (!Object.values(ComplaintStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const complaint = await complaintRepository.findOne({
      where: { id: parseInt(id), user_id: req.userId },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (!isValidStatusTransition(complaint.status, status)) {
      return res.status(400).json({
        error: `Invalid status transition from ${complaint.status} to ${status}`,
      });
    }

    const oldStatus = complaint.status;
    complaint.status = status;
    complaint.status_updated_at = new Date();

   const complainRepo=  await complaintRepository.save(complaint);

    const CompleteStatus = await handleComplaintStatusChange(complaint, oldStatus, status);

    res.json({
      message: "Complaint status updated successfully",
      complaint: {
        id: complaint.id,
        status: complaint.status,
        status_updated_at: complaint.status_updated_at,
      },
    });
  } catch (error) {
    console.error("Update complaint status error:", error);
    res.status(500).json({ error: "Failed to update complaint status" });
  }
};

const getComplaintMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("get Complaint Id", id);
    

    const complaint = await complaintRepository.findOne({
      where: { id: parseInt(id), user_id: req.userId },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    const now = new Date();
    const createdAt = new Date(complaint.created_at);
    const statusUpdatedAt = new Date(complaint.status_updated_at);

    const totalTimeMinutes = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60),
    );

    const timeInCurrentStatusMinutes = Math.floor(
      (now.getTime() - statusUpdatedAt.getTime()) / (1000 * 60),
    );

    res.json({
      complaint_id: complaint.id,
      current_status: complaint.status,
      time_in_current_status_minutes: timeInCurrentStatusMinutes,
      total_time_minutes: totalTimeMinutes,
    });
  } catch (error) {
    console.error("Get complaint metrics error:", error);
    res.status(500).json({ error: "Failed to fetch complaint metrics" });
  }
};

module.exports = {
  createComplaint,
  updateComplaintStatus,
  getComplaintMetrics,
};
