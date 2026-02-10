import jwt from "jsonwebtoken";
import {User} from "../models/userModel.js"

export const profileController = async(req,res) => {
    const token=req.cookies?.authToken;
    if(token){
       jwt.verify(token,process.env.key,async(err,userData)=>{
        if(err){
            throw err;
        }
        const connUser=await User.findOne({_id:userData.id});
        res.json(connUser);

       })
    }else{
        res.status(400).json("No Token Available")
    }
 
}

export const updateProfileController = async (req, res) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json("No Token Available");
    }

    jwt.verify(token, process.env.key, async (err, userData) => {
      if (err) {
        return res.status(403).json("Invalid token");
      }

      const { firstName, lastName, email, avatarLink } = req.body;

      // Use token user id instead of trusting body id
      const userConn = await User.findById(userData.id);

      if (!userConn) {
        return res.status(404).json("User not found");
      }

      // Only update fields if they were actually sent
      if (firstName !== undefined) userConn.firstName = firstName;
      if (lastName !== undefined) userConn.lastName = lastName;
      if (email !== undefined) userConn.email = email;
      if (avatarLink !== undefined) userConn.avatarLink = avatarLink;

      await userConn.save();

      res.json(userConn);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
};


