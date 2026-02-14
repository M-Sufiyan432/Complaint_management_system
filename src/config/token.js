
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const getAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "7m" }
  );
};

const getRefreshToken = () => {
  // RANDOM string, NOT JWT
  return crypto.randomBytes(64).toString("hex");
};

 const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};


module.exports = { getAccessToken, getRefreshToken,generateResetToken };
