import { User } from "../models/user.models.js"



const fetchAllUser = async(req,res)=>{
    try {
        const admin = await User.findById(req.user._id)
        if(!admin.roles == "admin"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }
        console.log(admin)
        const user = await User.find().select("-password -refresh_token")
        if(!user){
            return res.status(404).json({
                message: "no users found"
            })
        }
        res.status(200).json({
            message:"Here is the details",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message:"Error Occured"
        })
    }
}

const deleteUser = async(req,res)=>{
    try {
        const admin = await User.findById(req.user._id)
        if(!admin.roles == "admin"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }
        
        const deletedUser = await User.deleteOne({_id:req.params._id})
        
        if(!deletedUser){
            return res.status(500).json({
                message:"User Not Found"
            })
        }
        res.status(200).json({
            message:"Successfull",
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Delete Failed"
        })
    }
}

export {fetchAllUser,deleteUser}