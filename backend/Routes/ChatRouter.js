const express = require("express");
const ChatRouter = express.Router();
const ChatController = require("../Controllers/ChatController");
const userAuthMiddleware = require("../middlewares/UserAuthMiddleware");

// ChatRouter.route("/chat").get(ChatController.Chat);
// ChatRouter.route("/singleChat/:id").get(ChatController.SingleChat);
ChatRouter.route("/access").post(userAuthMiddleware, ChatController.AccessChat);
ChatRouter.route("/fetch").get(userAuthMiddleware, ChatController.FetchChats);
ChatRouter.route("/group").post(
  userAuthMiddleware,
  ChatController.CreateGroupChat
);
ChatRouter.route("/rename").put(
  userAuthMiddleware,
  ChatController.RenameGroupChat
);
ChatRouter.route("/groupremove").put(
  userAuthMiddleware,
  ChatController.RemoveFromGroup
);
ChatRouter.route("/groupadd").put(
  userAuthMiddleware,
  ChatController.AddToGroupChat
);

module.exports = ChatRouter;
