import { Job } from "../models/job.models.js"
import { User } from "../models/user.models.js"



const createJob = async(req,res)=>{
    try {
        const {title,company,description,salary,location,type} = req.body
        console.log(req.body)

        const user = await User.findById(req.user._id)
        if(!user.roles =="employer" ||!user.roles =="admin" ){
            return res.status(500).json({
                message:"Access Denied"
            })
        }

        const job = await Job.create({
            title:title ,
            company:company ,
            description:description ,
            salary: salary ,
            location :location ,
            type:type ,
            posted_by :req.user._id

        })
       
        const createdJob = await Job.findById(job._id)
        if(!createdJob){
            return res.status(500).json({
                message:"Job not created"
            })
        }
        res.status(200).json({
            message:"Job Posted",
            data:createdJob
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error Occured in Creating Job" -error
        })
    }
}

const fetchJobs = async  (req,res)=>{
    try {
        let page = parseInt(req.query.page) || 1
        let perpage = parseInt(req.query.perpage) ||2
        let type = req.query.type


        let jobFilter = {}
        jobFilter.types = type


        const job = await Job.find(jobFilter)
       .skip((page-1)*perpage)
       .limit(perpage)


        const totalJobs = await Job.countDocuments(jobFilter)
        res.status(200).json({
            message:"Job Fetched",
            page:page,
            perpage:perpage,
            data:job,
            total :totalJobs

        })

    } catch (error) {
        res.status(500).json({
            message:"Could Not fetch Details"
        })
    }
}

const getJob = async(req,res)=>{
    try {
        const requiredJob = await Job.findById(req.params._id).populate("posted_by","name")
        if(!requiredJob){
            return res.status(404).json({
                message:"Content Not Found"
            })
        }
        res.status(200).json({
            message:"Here is the details",
            data:requiredJob
        })
        
    } catch (error) {
        res.status(500).json({
            message:" couldnot get the required Job News"
        })
    }
}

const updateJob = async(req,res)=>{
    try {
        const {title,company,location,salary,description,type} = req.body
        const user = await User.findById(req.user._id)
        if(!user.roles == "admin" || !user.roles  == "employer"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }

        const up = await Job.findByIdAndUpdate(req.params._id,{
            $set:{
                title,
                company,
                location,
                salary,
                description,
                type,
            }
        }).populate("posted_by","name")

        if (!up){
            return res.status(500).json({
                message:"Details Not Updated"
            })
        }
        res.status(200).json({
            message:"Details Updated",
            data: up 
        })
    } catch (error) {
        res.status(500).json({
            message:"Update Failed"
        })
    }
}

const deleteJob = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(!user.roles == "admin" || !user.roles == "employer"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }
        const job = await Job.findById(req.params._id).populate("title")
        if(!job){
            return res.status(404).json({
                message:"Job Not Found"
            })
        }
            await Job.deleteOne({_id:req.params._id})
            res.status(200).json({
                message:"Deleted Successfully"
            })
    } catch (error) {
        res.status(500).json({
            message:"Delete Failed",
            data : job
        })
    }
}
export {createJob,fetchJobs,getJob,updateJob,deleteJob}