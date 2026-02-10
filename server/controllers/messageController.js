import Message from "../models/messageModel.js";

const messageController = async (req, res) => {
  try {
    const { userId } = req.params;
    const ourUserId = req.user._id;

    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Message fetch error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export default messageController;
