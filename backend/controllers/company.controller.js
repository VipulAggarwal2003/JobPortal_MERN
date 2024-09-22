import {Company} from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async(req,res) =>{
    try {
        const {companyName} = req.body;

        if(!companyName){
            return res.status(400).json({
                message: "Company Name is required",
                success: false
            })
        }
        let company = await Company.findOne({companyName:companyName});

        if(company){
            return res.status(400).json({
                message:"Company already registered",
                success:false
            })
        }
        company = await Company.create({
            companyName:companyName,
            userId : req.id
        });
        return res.status(201).json({
            message:"Company registered Successfully",
            company,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}


export const getCompany = async(req,res) =>{
    try {
        
       const userId = req.id; // logged in user Id
       const companies = await Company.find({userId}); 
       if(!companies){
         return res.status(400).json({
            message:"Companies not found",
            success: false
         })
       }

       return res.status(201).json({
        companies,
        success: true
     })       

    } catch (error) {
        console.log(error);
    }
}


export const getCompanyById = async(req,res) =>{
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if(!company){
            return res.status(400).json({
                message:"Company not found",
                success: false
             })
        }
        return res.status(201).json({
            company,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}


export const updateCompany = async(req,res) =>{
    try {
        const {companyName,description,website,location} = req.body;
        const file = req.file;
        // Cloudinary comes here....
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = {companyName,description,website,location,logo};

        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});
        if(!company){
            return res.status(404).json({
                message:"company not found",
                success: false
            })
        }
        return res.status(201).json({
            message:"company information updated",
            success: true
        });

    } catch (error) {
        console.log(error);
        
    }
}