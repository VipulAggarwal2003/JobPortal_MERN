import {Job} from "../models/job.model.js";
// for admin
export const postJob = async(req,res) =>{
    try {
        const {title,description,requirements,salary,location,jobType,position,experience,companyId} = req.body;

        const userId = req.id;

        if(!title || !description || !requirements || !salary || !location || !jobType ||
            !position || !experience || !companyId){
            return res.status(400).json({
                message:"something is missing",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary : Number(salary),
            location,
            jobType,
            position,
            experience : experience,
            company:companyId,
            created_by: userId
        });

        return res.status(200).json({
            message:"New job created successfully",
            job,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}
// for jobseeker
export const getAllJobs = async(req,res) =>{
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title: {$regex : keyword,$options:"i"}},
                {description: {$regex : keyword,$options:"i"}}
            ]
        };

        const jobs = await Job.find(query)
        .populate({
            path:"company"
        })
        .sort({ 
            createdAt:-1
        });

        if(!jobs){
            return res.status(400).json({
                message:"Jobs not found",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}
// for jobseeker
export const getJobById = async(req,res) =>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(400).json({
                message: "job not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

// how many jobs did admin created till now
export const getAdminJobs = async(req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path:'company',
            createdAt:-1
        });
        if(!jobs){
            return res.status(400).json({
                message: "jobs not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

export const getJobsByUserId = async (req,res)=>{
    const userId = req.params.id;
    if(userId){
        try {
            const savedJobs = await Job.find({ saved_by: { $in: [userId] } })
            .populate({
                path:'company'
            })
            .sort({ title: 1 });
            
           return res.status(201).json({
              savedJobs,
              success:true
            });
          } catch (error) {
            console.log(error);
            
            return res.status(401).json({ 
              message:"Failed to fetch saved jobs",
              success:false
            });
          }
    }
    else{
        return res.status(401).json({ 
            message:"User not Authenticated",
            success:false
          });
    }
}

export const saveJobForUser = async (req,res) =>{
   try {
    const {userId,jobId} = req.body;
    const job = await Job.findById(jobId);
    job.saved_by.push(userId);
    await job.save();

   return res.status(201).json({ message: "Job saved",success:true });

   } 
   catch (error) {
     console.log(error);
     return res.status(401).json({
        message:"Job not saved",
        success:false
     })
   }
}

export const unSaveJob = async (req,res)=>{
    try {
        const { userId, jobId } = req.body;
        
        // Find the job and remove the userId from the saved_by array
        const job = await Job.findByIdAndUpdate(
          jobId,
          { $pull: { saved_by: userId } },  // Remove userId from the saved_by array
          { new: true }  // Return the updated document
        );
    
        if (!job) {
          return res.status(404).json({ message: "Job not found", success: false });
        }
    
        res.status(200).json({
          message: "Job unsaved",
          success: true,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to unsave the job",
          success: false
        });
      }
}