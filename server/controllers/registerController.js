import {User,validateRegister} from "../models/userModel.js"
import Token from "../models/tokenModel.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utilis/sendEmail.js";

const registerController =async (req,res)=>{
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const existing = await User.findOne({ email: req.body.email });

    if (existing && existing.verified) {
      return res.status(409).send({ message: "User already exist" });
    }

    if (existing && existing.verificationLinkSent) {
      return res.status(409).send({
        message: "Verification Link Already Sent to this User",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let user = existing;

    if (!user) {
      user = await new User({
        ...req.body,
        password: hashPassword,
      }).save();
    }

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    }).save();

    const baseUrl = req.headers["x-client-url"] || "http://localhost:3000";
console.log("ch",baseUrl)
    const url = `${baseUrl}/users/${user._id}/verify/${token.token}`;

    try {
      await sendEmail(user.email, "Verify Email", url);
    } catch (err) {
      console.log("Email failed:", err.message);
      // Don't throw → avoid breaking response
    }

    user.verificationLinkSent = true;
    await user.save();

    return res.status(201).send({
      message: `Verification Email Sent to ${user.email}`,
    });

  } catch (error) {
    console.error("Error in registerController:", error);

    if (!res.headersSent) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
    
  
}
export default registerController;