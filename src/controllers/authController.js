const passport = require("passport");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { AppDataSource } = require("../config/database");
const { getAccessToken, getRefreshToken } = require("../config/token");

const userRepository = AppDataSource.getRepository("User");

const isProd = process.env.NODE_ENV === "production";

/* =========================
   COMMON TOKEN ISSUER
========================= */
const issueTokens = async (res, user, redirect = false) => {
  const accessToken = await getAccessToken(user.id);
  const refreshToken = await getRefreshToken();

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

  if (redirect) {
    return res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
  }

  res.status(200).json({
    accessToken,
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      onboarding_stage: user.onboarding_stage,
    },
  });
};

/* =========================
   REGISTER (LOCAL)
========================= */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      if (existingUser.provider && existingUser.provider !== "local") {
        return res.status(400).json({
          error: `Account exists with ${existingUser.provider}. Please login using that provider.`,
        });
      }

      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
      onboarding_stage: 0,
      onboarding_complete: false,
    });

    await userRepository.save(user);

    await issueTokens(res, user);

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

/* =========================
   LOGIN (LOCAL)
========================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.provider && user.provider !== "local") {
      return res.status(400).json({
        error: `Please login using ${user.provider}`,
      });
    }
    if (!user.password) {
  return res.status(400).json({
    error: "Please login using Google or GitHub",
  });
}

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await issueTokens(res, user);

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/* =========================
   OAUTH SUCCESS HANDLER
========================= */
const oauthSuccess = async (req, res) => {
  try {
    const user = req.user;
    await issueTokens(res, user, true);
  } catch (error) {
    console.error("OAuth error:", error);
    res.redirect(`${process.env.CLIENT_URL}/signin`);
  }
};

/* =========================
   LOGOUT
========================= */
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

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    res.json({ success: true, message: "Logged out" });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   ME
========================= */
const me = async (req, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        onboarding_stage: user.onboarding_stage,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in me",
    });
  }
};

module.exports = {
  register,
  login,
  logOut,
  me,
  oauthSuccess,
};