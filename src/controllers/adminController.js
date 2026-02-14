const { Not } = require("typeorm");
const { AppDataSource } = require("../config/database")

const complaintRepository = AppDataSource.getRepository("Complaint");
const userRepository = AppDataSource.getRepository("User")


const getAllComplaints = async(req,res)=>{
   try {
    const allComplaints = await complaintRepository.find();
    if(!allComplaints){
        res.status(404).json({
            succss : false,
            message : "No Compliant is found "
        })
    }
    res.status(200).json(allComplaints);
   } catch (error) {
    res.status(500).json({
        success : false,
        message:error
    })
   }
}
const getAllUsers = async(req,res)=>{
   try {
    const allUsers = await userRepository.find({
  where: {
    id: Not(req.userId),
  },
});
    if(!allUsers){
        res.status(404).json({
            succss : false,
            message : "No User is found "
        })
    }
    res.status(200).json(allUsers);
   } catch (error) {
    res.status(500).json({
        success : false,
        message:error
    })
   }
}

module.exports = {getAllComplaints,getAllUsers}