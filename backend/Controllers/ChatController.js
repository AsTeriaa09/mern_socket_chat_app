const { Error } = require("mongoose");
const Chat = require("../model/ChatModel");
const User = require("../model/UserModel");

// to access chats
const AccessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      console.log("userId param not sent with req");
      return res
        .status(400)
        .json({ message: "userId param not sent with req" });
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        //console.log(fullChat);
        return res.status(200).json(fullChat);
      } catch (error) {
        return res.status(500).json(Error);
      }
    }
  } catch (error) {
    console.error("Error in AccessChat:", error.message); // Log the error message
    return res.status(500).json({ message: error.message }); // Send a proper error response
  }
};

// to fetch one on one chat
const FetchChats = async (req, res) => {
  try {
    let fetchChat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    fetchChat = await User.populate(fetchChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });
    res.status(200).json(fetchChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to create a group chat
const CreateGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please Fill all the fields!" });
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({
      message: "More than 2 users are required to form a group chat",
    });
  }
  // to add currently logged in user to the group
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(fullGroupChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to change the group name by getting the group id
const RenameGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to remove a user from the group by id
const RemoveFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const RemoveUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!RemoveUser) {
      res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json(RemoveUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to add a new user to the group by id
const AddToGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!addUser) {
      res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json(addUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AccessChat,
  FetchChats,
  CreateGroupChat,
  RenameGroupChat,
  RemoveFromGroup,
  AddToGroupChat,
};
