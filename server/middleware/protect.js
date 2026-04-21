// middleware/protect.js
import { verifyAndCacheToken } from "../Services/sessionService.js"; // ← use existing service

async function protect(req, res, next) {
  try {
    const token =
      req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // verifyAndCacheToken handles Redis check + jwt.verify internally
    req.user = await verifyAndCacheToken(token);
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default protect;