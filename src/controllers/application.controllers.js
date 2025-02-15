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


    const fetchSingleUserApply = async(req,res)=>{
       
        try {
            const Single = await kaam.findOne({applied_by:req.user._id}).populate("applied_by","name")
            if(!Single){
                return res.status(500).json({
                    message:"No Apply Found"
                })
            }
            res.status(200).json({
                message :"Fetched Successfully",
                data :Single
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                
                message:"Error Occured"
            })
        }
    }

    const fetchAllApply = async(req,res)=>{
        try {
            const all = await kaam.find().populate("applied_by","name")
            if(!all){
                return res.status(500).json({
                    message:"No Apply"
                })
            }
            res.status(200).json({
                message:"Done",
                data:all
            })
        } catch (error) {
            return res.status(500).json({
                message:"Error Occured in fetching"
            })
        }
    }
export {applyJob,fetchSingleUserApply,fetchAllApply}
