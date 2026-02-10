
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
const userSchema=mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    verified:{type:Boolean,required:false},
    verificationLinkSent:{type:Boolean,default:false}, //  it set value automatically false
},{
    timestamps:true
})

userSchema.methods.generateAuthToken=function(){
const token=jwt.sign({
    id:this.id,
    email:this.email,
    },process.env.KEY,{expiresIn:"7d"})
    return token;

}

const User=mongoose.model("User",userSchema); // collection will be "users"
const validateRegister=(data)=>{
    const scheme=Joi.object({
          firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    })

   return scheme.validate(data);
}

const validateLogin=(data)=>{
    const scheme=Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    })

   return scheme.validate(data);
}


export { User, validateRegister, validateLogin };