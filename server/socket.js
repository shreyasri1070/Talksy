import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./models/messageModel.js";
import { User } from "./models/userModel.js";

export const createSocketServer = (server) => {
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // ✅ add this
      "http://localhost:5173",
      "https://swifty-chatty-appy.onrender.com",
    ],
    credentials: true,
  },
});

  // ✅ Auth middleware — runs before connection
  io.use((socket, next) => {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) return next(new Error("No cookie"));

    const tokenString = cookie
      .split(";")
      .find((str) => str.trim().startsWith("authToken="));

    if (!tokenString) return next(new Error("No auth token"));

    const token = tokenString.split("=")[1];
    jwt.verify(token, process.env.KEY, {}, async (err, userData) => {
      if (err) return next(new Error("Invalid token"));

      const user = await User.findById(userData.id);
      if (!user) return next(new Error("User not found"));

      // ✅ Attach user info to socket
      socket.userId = user._id.toString();
      socket.username = user.firstName + " " + user.lastName;
      next();
    });
  });

  // ✅ Notify all clients about online users
  const notifyAboutOnlinePeople = async () => {
    const sockets = await io.fetchSockets();

    const onlineUsers = await Promise.all(
      sockets.map(async (s) => {
        const user = await User.findById(s.userId);
        return {
          userId: s.userId,
          username: s.username,
          avatarLink: user?.avatarLink || null,
        };
      })
    );

    io.emit("online", onlineUsers); // ✅ broadcast to everyone
  };

  io.on("connection", (socket) => {
    console.log("✅ Connected:", socket.username, socket.userId);
    notifyAboutOnlinePeople();

    // ✅ Message handler
   socket.on("message", async ({ recipient, text, mediaUrl, publicId, mediaType }) => {
  if (!recipient || (!text && !mediaUrl)) return;

  const recipientId = typeof recipient === "object"
    ? recipient._id?.toString()
    : recipient.toString();

  const msg = await Message.create({
    sender: socket.userId,
    recipient: recipientId,
    text: text || "",
    mediaUrl: mediaUrl || null,
    publicId: publicId || null,
    mediaType: mediaType || null,
  });

  const recipientSockets = await io.fetchSockets();
  const targets = recipientSockets.filter((s) => s.userId === recipientId);

  targets.forEach((s) => {
    s.emit("message", {
      sender: socket.userId,
      text: msg.text,
      mediaUrl: msg.mediaUrl,
      mediaType: msg.mediaType,
      id: msg._id,
    });
  });
});

    // ✅ Disconnect
    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.username);
      notifyAboutOnlinePeople();
    });
  });
};

