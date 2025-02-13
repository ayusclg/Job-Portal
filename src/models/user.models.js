import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'


const userSchema = new mongoose.Schema({
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true
            },
            contact:{
                type:Number,
                required:true
            },
            address:{
                type:String,
                required:true
            },
            roles:{
                type:String,
                enum:['admin','employer','job-seeker'],
                required:true
            },
            refresh_token:{
                type:String
            },
            photo:{
                type:String,
                required:true
            }
    
},


{timestamps:true})


userSchema.pre("save",async function (next){
    if(!this.isModified("password"))return next()
    this.password = bcryptjs.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcryptjs.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async()=>{
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
)}

userSchema.methods.generateRefreshToken = async()=>{
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
)}
export  const User = mongoose.model("User",userSchema)