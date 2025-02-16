import mongoose from "mongoose";
import { Job } from "./job.models.js";
import { User } from "./user.models.js";

const applicationSchema = new mongoose.Schema({
    apply:{
        type:{
        job_id:{
        type: mongoose.Types.ObjectId,
        ref: Job,
       
    },
    name:{
        type:String,
        
    },
    salary:{
        type:Number,
        
    },
    location:{
        type:String,
        
    },
    method:{
        type:String,
        
    },
    
}},
    applied_by:{
    type:mongoose.Types.ObjectId,
    ref:User,
    required:true
    },
    Cv :{
        type:String,
        
    }
    
    
    
} 
    ,{timestamps:true})

    export const kaam = mongoose.model("Kaam",applicationSchema)

   
