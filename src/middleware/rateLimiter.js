const rateLimit = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many reset attempts. Try again later.",
  },
});

module.exports = { forgotPasswordLimiter };
