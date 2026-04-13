import mongoose from "mongoose";
const { Schema, Types: { ObjectId } } = mongoose;

const messageSchema = new Schema({
  sender:    { type: ObjectId, ref: "User", required: true },
  recipient: { type: ObjectId, ref: "User", required: true },
  text:      { type: String, default: "" },
  mediaUrl:  { type: String, default: null },
  publicId:  { type: String, default: null }, // ✅ for deleting from cloudinary
  mediaType: {
    type: String,
    enum: ["image", "video", "audio", "file", null],
    default: null,
  },
}, { timestamps: true });

const message=mongoose.model("message",messageSchema)

export default message;

