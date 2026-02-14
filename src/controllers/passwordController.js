const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { AppDataSource } = require("../config/database");
const { sendResetPasswordEmail } = require("../services/emailService");
const { generateResetToken } = require("../config/token");

const userRepository = AppDataSource.getRepository("User");


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent.",
      });
    }


    const {rawToken,hashedToken} = generateResetToken()

    user.reset_password_token = hashedToken;
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.save(user);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await sendResetPasswordEmail(user.email, resetUrl);

    res.json({
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userRepository.findOne({
      where: { reset_password_token: hashedToken },
    });

    if (
      !user ||
      !user.reset_password_expires ||
      user.reset_password_expires < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;

   
    user.refresh_token = null;

    await userRepository.save(user);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  console.log("change Password Hit")
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await userRepository.findOne({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await userRepository.save(user);

    res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};


module.exports = {
  forgotPassword,
  resetPassword,
  changePassword
};
