const Chat = require("../model/ChatModel");
const Message = require("../model/MessageModel");
const User = require("../model/UserModel");

// 3 things required - chatId, sender and Message schema
const SendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res
            .status(400)
            .json({ message: "Invalid data passed into request" });
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        let message = await Message.create(newMessage);
        // .execPopulate is method on document, while .populate works on query object.
        message = await message.populate("sender", "name picture")
        message = await message.populate("chat");
        // getting users info from User model
        message = await User.populate(message, {
            path: "chat.users",
            select: "name picture email",
        });
        // updating the chatId and message with latestmessage everytime a new msg is sent
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// as we are using :chatId in router, we have to use params here.
const AllMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email").populate("chat")

        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { SendMessage, AllMessages };
