const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const { getAccessToken, getRefreshToken } = require('../config/token');
const dotenv = require('dotenv').config()
const crypto = require('crypto')

const userRepository = AppDataSource.getRepository('User');

const register = async (req, res) => {

  try {

    const { name, email, password } = req.body;
    // console.log("Test Req.body",req.body);
  
    const existingUser = await userRepository.findOne(
      { where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password",hashedPassword);
    

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      onboarding_stage: 0,
      onboarding_complete: false
    });

    const accessToken = await getAccessToken(user.id);
    // console.log("AcessTokenn in register",accessToken);
    
    const refreshToken = await getRefreshToken(user.id);
    // console.log("Refresh Token in register",refreshToken);
    

    user.refresh_token = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    await userRepository.save(user);

    const isProd = process.env.NODE_ENV == "production";
    
    res.cookie("refreshToken",refreshToken,{
     httpOnly : true,
     secure : isProd,
     sameSite: isProd ? "none" : "lax",
     maxAge: 7 * 24 * 60 * 60 * 1000,

    })

    res.status(201).json({
      message: 'User Register Successfully',
      accessToken,
      user: {
        id: user.id,
        role:user.role,
        name: user.name,
        email: user.email,
        onboarding_stage: user.onboarding_stage
      }
    });
  } catch (error) {
    console.error('Register error in backend:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("Login req.body",req.body);
    

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // const token = jwt.sign(
    //   { userId: user.id },
    //   process.env.JWT_SECRET  ,
    //   { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    // );

    const accessToken =await getAccessToken(user.id);
    // console.log("Acesstoken",accessToken);
    

    
    const isProd = process.env.NODE_ENV === "production";
    
    const refreshToken = getRefreshToken();

user.refresh_token = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");

await userRepository.save(user);

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        role : user.role,
        email: user.email,
        onboarding_stage: user.onboarding_stage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const logOut = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const hashed = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await userRepository.update(
        { refresh_token: hashed },
        { refresh_token: null }
      );
    }

    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({ success: false });
  }
};


const me = async(req,res)=>{
try {
  const user = await userRepository.findOne({
    where:{id:req.userId}
  })
  console.log("Me back",user);
  
  if(!user){
    return res.status(400).json({
      success:false,
      message: "User is not found "
    })
  }
  res.status(201).json(
   {
    user : {
      id : user.id,
      name : user.name,
      role : user.role,
      email : user.email,
      onboarding_stage: user.onboarding_stage
    }
   })
} catch (error) {
  console.log("error",error);
  
  res.status(500).json({
    success:false,
    message : "error in Me "
  })
}
}

module.exports = { register, login,me ,logOut};