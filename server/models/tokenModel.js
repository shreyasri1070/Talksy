import mongoose from "mongoose";

const tokenSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,require:true,unique:true, ref:'User'},
    token :{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    expiresAt:{type:Date,default:Date.now+36000}
})
const token=mongoose.model('token',tokenSchema)
export default token;

