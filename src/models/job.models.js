import mongoose from "mongoose";

 const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    company:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum:["onsite","Remote","Part-time"]
    
    },
    location:{
        type:String,
        required:true
    },
    posted_by:{
        type:mongoose.Types.ObjectId,
        ref:"User"
        
    }
 },{timestamps:true})

 export const Job = mongoose.model("Job",jobSchema)