import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'

const verifyToken = async function (req,res,next){

    try {
        const token = req.cookies?.accessToken
        console.log(req.cookies)
        if(!token){
           return res.status(500).json(
                {
                    message:"error in fetching the token"
                }
            )
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       
        const user = await User.findById(decodedToken._id).select("-password -refresh_token")
        if(!user){
            return res.status(400).json({
                message:"user couldnot be fetched"
            })
        }
       req.user = user
       next()
    } catch (error) {
        res.status(500).json({
            message:"error occured in auth"
        })
    }
}
export default verifyToken