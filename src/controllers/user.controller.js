import { User } from "../models/user.models.js"
import fs from 'fs'

const generateAccessTokenOnly = async(userId)=>{
   try {
     const user = await User.findById(userId)
     const accessToken = await user.generateAccessToken()
     return accessToken;
   } catch (error) {
    console.log("error occured in generating access token",error)
   }
}
const generateRefreshTokenOnly = async(userId)=>{
try {
    const user = await User.findById(userId)
    const refreshToken = await user.generateRefreshToken()
    user.refresh_token =refreshToken
    await user.save({validateBeforeSave:false})
    return refreshToken;
} catch (error) {
    console.log("error in generating refresh token",error)
}
}
const userRegister = async function (req,res){
  try {
        const{name,email,password,contact,address,roles} = req.body
        const isExist = await User.findOne({email:email})
        if(isExist){
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                  if (err) console.log("Error occurred while deleting file after user creation:", err);
                });
              }
            return res.status(403).json({
                message: "user already exist"
            })
            
        }

        const photoUrl = `/public/images/${req.file.filename}`

        const user = await User.create({
            name,
            email,
            password,
            contact,
            address,
            roles,
            photo:  photoUrl
        })
        console.log(user)
        if(!user){
            return console.log("error in creating user")
        }

        const createdUser = await User.findById(user._id).select("-password -refresh_token") 
        if(!createdUser){
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                  if (err) console.log("Error occurred while deleting file after user creation:", err);
                });
              }
           return res.status(500).json({
                message:"Couldnot create User"
            })
        }

           return res.status(200).json({
            message:"User Created",
            data: createdUser
        })


  } catch (error) {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log("Error occurred while deleting file after user creation:", err);
        });
      }
    res.status(500).json({
        message:"Error Occured In Registering User"
    })
  }
}

const userLogin = async function (req,res) {
    try {
        const {email,password}=req.body
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({
                message:"User Doesnot Exist"
            })
        }
       
        const isPasswordValid = await user.isPasswordCorrect(password)
        
        if(!isPasswordValid){
            return res.status(500).json({
                message:"Password Wrong"
            })
        }

        const accesstoken = await generateAccessTokenOnly(user._id)
        const refreshtoken = await generateRefreshTokenOnly(user._id)
       

        if(!accesstoken || !refreshtoken){
            return res.status(500).json({
                message:"failed to generate tokens"
            })
        }


        const loggedUser = await User.findById(user._id).select("-password -refresh_token")
        if(!loggedUser){
            res.status(500).json({
                message:"User couldnot log"
            })
        }
        const options = {
            httpOnly:true,
            secure:true
        }

        return res.status(200)
        .cookie("accessToken",accesstoken,options)
        .cookie("refreshToken",refreshtoken,options)
        .json({
            message:"logged in !!",
            data:loggedUser
        })
    } catch (error) {
        res.status(500).json({
            message:"error in loggin in"
        })
    }
    
}

const currentUser = async function (req,res){
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        return res.status(200).json({
            message:"User fetched",
            data: user
        })
        
    } catch (error) {
        res.status(400).json({
            message:"error occured in fetching user"
        })
    }
}

export {userRegister,userLogin,currentUser}