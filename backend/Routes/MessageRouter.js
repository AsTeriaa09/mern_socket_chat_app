const express = require("express");
const userAuthMiddleware = require("../middlewares/UserAuthMiddleware");
const MessageRoute = express.Router();
const MessageController = require("../Controllers/MessageController")

MessageRoute.route("/sendmsg").post(userAuthMiddleware, MessageController.SendMessage)
MessageRoute.route("/fetchmsg/:chatId").get(userAuthMiddleware, MessageController.AllMessages)

module.exports = MessageRoute;