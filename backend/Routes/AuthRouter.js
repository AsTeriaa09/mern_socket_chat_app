const express = require("express");
const AuthRoute = express.Router();
const AuthController = require("../Controllers/AuthControllers");
const validate = require("../middlewares/ValidationMiddleware");
const { SignUpVal, LoginVal } = require("../Validation/AuthValidation");
const userAuthMiddleware = require("../middlewares/UserAuthMiddleware");

AuthRoute.route("/signup").post(validate(SignUpVal), AuthController.SignUp);

AuthRoute.route("/login").post(validate(LoginVal), AuthController.Login);
AuthRoute.route("/updatePic").put(AuthController.updateUserPicture);
// to get logged in user data
AuthRoute.route("/loggeduser").get(
  userAuthMiddleware,
  AuthController.loggedUser
);
// to get all users
AuthRoute.route("/user").get(userAuthMiddleware, AuthController.allUsers);

module.exports = AuthRoute;
