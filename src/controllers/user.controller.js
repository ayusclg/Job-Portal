import { User } from "../models/user.models.js"
import fs from 'fs'



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

export {userRegister}