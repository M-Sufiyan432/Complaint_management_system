const { AppDataSource } = require("../config/database");

const userRepostary = AppDataSource.getRepository('User')



const authorize = (...roles) => {

  return async(req, res, next) => {
    try {
    const user = await userRepostary.findOne({
      where:{id:req.userId}
    })
    
    if (!user || !roles.includes(user?.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }
    next();
    } catch (error) {
      console.log("Test error");
      
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};

module.exports = { authorize };
