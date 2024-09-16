const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
require("dotenv").config();

//const JWT_KEY = process.env.JWT_SECRET_KEY;

const userAuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized http , token not provided!" });
  }
  const jwtToken = token.replace("Bearer", "").trim();
  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_KEY);
    const UserInfo = await User.findOne({ email: isVerified.email }).select(
      "-password"
    );
    req.user = UserInfo;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = userAuthMiddleware;
