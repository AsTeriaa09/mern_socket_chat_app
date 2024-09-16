const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// to hash password
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltRound = await bcryptjs.genSalt(10);
    const hash_pass = await bcryptjs.hash(user.password, saltRound);
    user.password = hash_pass;
    next();
  } catch (error) {
    next(error);
  }
});

// to compare password
UserSchema.methods.comparePass = async function (password) {
  try {
    return await bcryptjs.compare(password, this.password);
  } catch (error) {
    console.log(error);
  }
};

// to generate token
UserSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "60d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const User = new mongoose.model("User", UserSchema);

module.exports = User;
