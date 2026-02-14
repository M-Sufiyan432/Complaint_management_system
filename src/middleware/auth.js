const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("AUTH HEADER:", authHeader);
    // console.log("JWT SECRET:", process.env.JWT_SECRET);

    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    // console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("DECODED TOKEN:", decoded);

    req.userId = decoded.id; // or decoded.userId
    // console.log("auth js ",req.userId);
    
    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
