const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (to, resetUrl) => {
  console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset.</p>
        <p>This link expires in 15 minutes.</p>
        <a href="${resetUrl}"
           style="
             display: inline-block;
             padding: 10px 16px;
             background: #2563eb;
             color: white;
             text-decoration: none;
             border-radius: 6px;
           ">
          Reset Password
        </a>
      </div>
    `,
  });
};

module.exports = { sendResetPasswordEmail };
