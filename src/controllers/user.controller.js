import { User } from "../models/user.models.js"
import fs from 'fs'
import jwt from 'jsonwebtoken'

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

        const CvUrl = `/public/images/${req.file.filename}`

        const user = await User.create({
            name,
            email,
            password,
            contact,
            address,
            roles,
            Cv:CvUrl
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

const updateUser = async function (req,res){
    try {
        const {name,email,contact,address,} = req.body
        const update = await User.findByIdAndUpdate(req.user._id,{
            $set:{
                name,
                email,
                contact,
                address
            }},
            {
                new:true
            }
        ).select("-password -refresh_token")
        if(!update){
            return res.status(400).json({
                message:"Error Updating Details"
            })
        }
        res.status(200).json({
            message: "Updated User",
            data:update
        })
    } catch (error) {
        res.status(500).json({
            message:"Error Updating User"
        })
    }
}

const updatePassword = async(req,res)=>{
    try {
        const {oldPassword,newPassword} =req.body

        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(500).json({
                message:"Couldnot Fetch User"
            })
        }
        const isPasswordRight = await user.isPasswordCorrect(oldPassword)
        if(!isPasswordRight){
            return res.status(500).json({
                message:"Incorrect Old Password"
            })
        }
        user.password = newPassword
        await user.save({validateBeforeSave:false})

        return res.status(200).json({
            message:"Password Successfully Changed"
        })

    } catch (error) {
        res.status(500).json({
            message:"Error Updating Password"
        })
    }
}

const UpdatePhoto = async(req,res)=>{
    try {
        const ExistingPhoto = req.file?.path
        if(!ExistingPhoto){
            return res.status(404).json({
                message:"Couldnot Find Old Photo"
            })
        }
        const newPhotoUrl = `public/images/${req.file.filename}`

        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{
                photo : newPhotoUrl
            }
        },
            {
                new:true
            }
    ).select("-password -refresh_token")

    if(!user){
        return res.status(500).json({
            message:"Couldnot Fetch User"
        })
    }

    res.status(200).json({
        message:"New Photo Updated"
    })
    } catch (error) {
        res.status(500).json({
            message:"Error Updating Photo"
        })
    }
}
const userLogout = async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{
                refresh_token: undefined
            }
        },
        {
            new:true
        }
    ).select("-password -refresh_token")
    const Options = {
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .clearCokkie("accesstoken",Options)
    .clearCokkie("refreshtoken",Options)
    .json({
        message:"Logout Successful"
    })

    } catch (error) {
        res.status(400).json({
            message:"Error Logging Out"
        })
    }
}

const refreshTokenAccess = async(req,res)=>{
    try {
        const token = req.cookies?.refresh_token
        if(!token){
            return res.status(404).json({
                message:"Token Not Found"
            })
        }

        const decodedToken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            return res.status(400).json({
                message:"Couldnot Access User"
            })
        }
        const accessTokennew = await generateAccessTokenOnly(user._id)

        if(!accessTokennew ){
            return res.status(500).json({
                message:"Access  Not Generated"
            })
        }
        const options ={
            httpOnly:true,
            secure:true
        }
        res.status(200).setCookie('accesstoken',accessTokennew,options)
        .json({
            message:"sucessfully new access token created",
            data:accessTokennew
        })
    } catch (error) {
        res.status(500).json({
            message:"Couldnot Generate Access Token"
        })
    }
}
export {userRegister,userLogin,currentUser,updateUser,updatePassword,UpdatePhoto,userLogout,refreshTokenAccess}