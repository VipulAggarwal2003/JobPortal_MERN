import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }
    const file = req.file;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
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
        message: "Incorrect email or password",
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
        message: "Account doesn't exists with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
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

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Login successfully! \n Welcome  ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.files["file"];
    const photo = req.files["profilePhoto"];
    console.log(photo);
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponseFile = await cloudinary.uploader.upload(
        fileUri.content,
        {
          resource_type: "raw",
          format: "pdf",
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
        photoUri.content
      );

      if (cloudResponsePhoto) {
        user.profile.profilePhoto = cloudResponsePhoto.secure_url; // save the cloudinary url
      }
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
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
