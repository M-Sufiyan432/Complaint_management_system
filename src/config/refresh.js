const crypto = require("crypto");
const { AppDataSource } = require("./database");
const { getAccessToken, getRefreshToken } = require("./token");

const userRepository = AppDataSource.getRepository("User");

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Incoming RefreshToken:", refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const user = await userRepository.findOne({
      where: { refresh_token: hashedRefreshToken },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = getAccessToken(user.id);
    const newRefreshToken = getRefreshToken();

    user.refresh_token = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await userRepository.save(user);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.sendStatus(403);
  }
};

module.exports = { refresh };
