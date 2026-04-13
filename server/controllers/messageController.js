// messageController.js
import cloudinary from "../cloudinary.js";
import Message from "../models/messageModel.js";
import redis from "../config/redis.js";  // ← add this import

// helper — builds a consistent cache key for any conversation
const getCacheKey = (userId, ourUserId) => {
  // sort IDs so "A↔B" and "B↔A" always produce the same key
  const sorted = [userId.toString(), ourUserId.toString()].sort().join(":");
  return `messages:${sorted}`;
};

export const messageController = async (req, res) => {
  try {
    const { userId } = req.params;
    const ourUserId = req.user._id;
    const cacheKey = getCacheKey(userId, ourUserId);

    // 1. Check Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2. Cache miss — hit MongoDB
    const messages = await Message.find({
      sender:    { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    // 3. Store in Redis for 5 minutes (300 seconds)
    await redis.setex(cacheKey, 300, JSON.stringify(messages));

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const deletemessageController = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // delete from Cloudinary if media exists
    if (message.publicId) {
      await cloudinary.uploader.destroy(message.publicId, {
        resource_type: message.mediaType === "video" ? "video" : "image",
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    // 4. Invalidate the cache so deleted message doesn't show up
    const cacheKey = getCacheKey(message.sender, message.recipient);
    await redis.del(cacheKey);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};