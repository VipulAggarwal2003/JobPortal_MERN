import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
      required:true
    },
  ],
  responsibility:{
     type:String,
  },
  salary: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  experience:{
     type: Number,
     required:true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  saved_by:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
  ,
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
},{timestamps:true});
export const Job = mongoose.model('Job',jobSchema);