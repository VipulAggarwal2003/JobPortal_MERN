import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }
    user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this PhoneNumber",
        success: false,
      });
    }

    const file = req.files["file"];
    const hashedPassword = await bcrypt.hash(password, 10);

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        max_file_size: 2 * 1024 * 1024,
      });
      await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        profile: {
          profilePhoto: cloudResponse.secure_url,
        },
      });
    } else {
      await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
      });
    }
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Not found!",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // now check if the role is correct
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: `Login successful! \n Welcome ${user.fullname}`,
      user,
      token, // Send token in the response body
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     if (!email || !password || !role) {
//       return res.status(400).json({
//         message: "Something is missing",
//         success: false,
//       });
//     }
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         message: "Incorrect email or password",
//         success: false,
//       });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         message: "Incorrect email or password",
//         success: false,
//       });
//     }
//     // now check if the role is correct
//     if (role != user.role) {
//       return res.status(400).json({
//         message: "Account doesn't exists with current role",
//         success: false,
//       });
//     }
//     const tokenData = {
//       userId: user._id,
//     };
//     const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile,
//     };

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpsOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Login successfully! \n Welcome  ${user.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const logout = async (req, res) => {
//   try {
//     return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//       message: "logged out successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.files["file"];
    const photo = req.files["profilePhoto"];

    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponseFile = await cloudinary.uploader.upload(
        fileUri.content,
        {
          resource_type: "raw",
          format: "pdf",
          max_file_size: 5 * 1024 * 1024,
        }
      );
      if (cloudResponseFile) {
        user.profile.resume = cloudResponseFile.secure_url; // save the cloudinary url
        user.profile.resumeOriginalName = file[0].originalname; // save the original file name
      }
    }

    if (photo) {
      const photoUri = getDataUri(photo);
      const cloudResponsePhoto = await cloudinary.uploader.upload(
        photoUri.content,
        {
          max_file_size: 2 * 1024 * 1024,
        }
      );

      if (cloudResponsePhoto) {
        user.profile.profilePhoto = cloudResponsePhoto.secure_url; // save the cloudinary url
      }
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    // updating the data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile Updated Successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userRole = req.body.role;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        message:"something went wrong!",
        success: false,
      });
    }
    if(userRole == 'jobSeeker'){
      // role is jobSeeker
      const deletedApplicant = await Application.DeleteMany({applicant:userId});
    }
    else{
      // role is recuiter
      const deletedCompany = await Company.deleteMany({userId : userId});
      const jobs = await Job.find({created_by:userId});
      const deletedJobs = await Job.deleteMany({created_by:userId});
      const jobIds = jobs?.map(job=> job?._id);
      const deletedAllApplicants = await Application.deleteMany({ job: { $in: jobIds } })
    }
   
    return res.status(201).json({
      message: "Profile Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
