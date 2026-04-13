import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";              // ✅ add this
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connection from "./db/db.js";
import userRoute from "./routes/userRoute.js";
import avatarRoute from "./routes/avatarRoute.js";
import messageRoute from "./routes/messageRoute.js"
 
import { createSocketServer } from "./socket.js";
import uploadRoute from "./routes/uploadRoute.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connection();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5173",           //add your Vite frontend port
  "https://swifty-chatty-appy.onrender.com",
];

const corsOption = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOption));
app.use("/api/user", userRoute);
app.use("/api/avatar", avatarRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/user/message", messageRoute);
const port = process.env.port || 8000;      // ✅ lowercase port

const server = http.createServer(app);      // ✅ create http server from app
createSocketServer(server);                 // ✅ attach socket BEFORE listen

server.listen(port, () => console.log(`Server running on ${port}`)); // ✅ use port not PORT