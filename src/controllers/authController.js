const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const dotenv = require('dotenv').config()

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
    

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      onboarding_stage: 0,
      onboarding_complete: false
    });

    await userRepository.save(user);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET ,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User Register Successfully',
      token,
      user: {
        id: user.id,
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET  ,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarding_stage: user.onboarding_stage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };