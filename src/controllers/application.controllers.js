import { kaam } from "../models/application.models.js"
import { Job } from "../models/job.models.js"
import { User } from "../models/user.models.js"
import fs from 'fs'
import mongoose from "mongoose"

const applyJob = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(!user.roles == "job-seeker"){
          
            return res.status(403).json({
                message:"Acess Denied"
            })
        }
        
        const jobApplied = await Job.findById(req.body.apply.job_id)
        

            req.body.apply.job_id=jobApplied._id
            req.body.apply.name = jobApplied.title;
            req.body.apply.location = jobApplied.location;
            req.body.apply.salary = jobApplied.salary;
            req.body.apply.method = jobApplied.type;

       
        const create = await kaam.create({

            apply:req.body.apply,
            applied_by:req.user._id,
             
        })
        if(!create){
            if(req.file){
                fs.unlink(req.file.path,(err)=>{
                    console.log(err)
                })
            }
            return res.status(500).json({
                message:"Job Application Failed"
            })
        }
        const appliedJob = await kaam.findById(create._id)

        res.status(200).json({
            message:"Successfully Applied",
            data:appliedJob
        })
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err)
            })
        }
        console.log(error)
        res.status(500).json({
            message:"Sorry Error Occured"
            
        })
    }}


export {applyJob}
