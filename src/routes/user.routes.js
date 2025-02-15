import Router from "router";
import { Upload } from "../middlewares/multer.middlewares.js";
import { currentUser, refreshTokenAccess, updatePassword, UpdatePhoto, updateUser, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import Joi from "joi";
import validator from 'express-joi-validation'
import fs from 'fs'
import verifyToken from "../middlewares/auth.middlewares.js";

const router = Router()
const validate = validator.createValidator()


const validateRegisterSchema = Joi.object({
    name:Joi.string().min(4).required(),
    email:Joi.string().email().required(),
    contact:Joi.string().pattern(/^[0-9]{10}$/).required().messages(
        {"string.pattern.base ":"Phone Number Must Be 10 Digit"},
        {"string.empty":"Phone Number is required"}
    ),
    password:Joi.string().min(8).max(14).required().pattern(new RegExp("^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*\\d).{8,}$")).messages({
        "string.pattern.base": "Password must include at least one special character, one uppercase letter, and one digit."
      }),
      roles: Joi.string().valid('admin', 'employer', 'job-seeker').required()
    }).unknown(true)
router.route("/reg").post(Upload.single("Cv"),
    async function(req,res,next){
    try {
        await validateRegisterSchema.validateAsync(req.body)
        next()
    } catch (error) {
        res.status(500).json({
            message:"error in validation"
        })
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                if(err) console.log("error occured",err)
            })
        }
    }
},
    userRegister)

router.route("/login").post(userLogin)
router.route("/get").get(verifyToken,currentUser)
router.route("/update").patch(verifyToken,updateUser)
router.route("/uPassword").patch(verifyToken,updatePassword)
router.route("/uPhoto").patch(Upload.single("Cv"),verifyToken,UpdatePhoto)
router.route("/logout").post(verifyToken,userLogout)
router.route("/newAccess").post(refreshTokenAccess)
export default router