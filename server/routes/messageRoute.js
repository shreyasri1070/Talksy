import express from "express";
import protect from "../middleware/protect.js";                              // ✅ import protect
import  {messageController, deletemessageController } from "../controllers/messageController.js"; // ✅ .js extension
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.get("/messages/:userId", protect, cacheMiddleware(300), messageController);
router.delete("/messages/:id", protect, deletemessageController);                  // ✅ protect delete too

export default router;