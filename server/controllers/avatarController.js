import Avatar from "../models/avatar.js";
export const avtarController=async(req,res)=>{
    const {link}=req.body;

    if(!link){
       return res.status(400).json({error:"Link is required"})
    }
try {
     const avatarLink=new Avatar({link})
    avatarLink.save();
     return res.status(201).json({ success: true, message: "Avatar link added successfully" });
    
} catch (error) {
     console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
}
   
}

export const getAllAvatars=async(req, res)=> {
  try {
    // Fetch all avatars from the database
    const avatars = await Avatar.find();

    // Return the list of avatars
    return res.status(200).json({ success: true, avatars });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}