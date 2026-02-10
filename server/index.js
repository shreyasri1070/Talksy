import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connection from "./db/db.js"
import userRoute from "./routes/userRoute.js";
import avatarRoute from "./routes/avatarRoute.js";
import { createWebSocketServer } from "./wsServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//database connection
connection();
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
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

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log("server is listening",port);
});
console.log(server);
createWebSocketServer(server);

// app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// app.use((req, res) => {
//   res.sendFile(
//     path.join(__dirname, "../frontend/dist/index.html"),
//     (err) => {
//       if (err) {
//         console.error("Error sending file:", err);
//       }
//     }
//   );
// });

