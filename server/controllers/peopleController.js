import {User} from "../models/userModel.js";
const peopleController=async(req,res)=>{

const verifiedUser=await User.find({verified:true});
console.log(verifiedUser,"verified user")
 res.json(verifiedUser);

}

export default  peopleController