import User from "../Models/userModel.js";
import bcrypt from "bcryptjs"
import generateToken from '../utils/generateToken.js'
import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose";
import Post from "../Models/postModel.js";
export const signUp=async(req,res)=>{
    try {
     const { name, email, username, password} = req.body;
     if(!name || !email || !username || !password){
        return res.status(400).json({
            message:"All Fields are required"
        })
     }   
     const user = await User.findOne({$or:[{email},{username}]})
     if(user){
        return res.status(400).json({
            message:"User Already Exists"
        })
     }
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password,salt)
     const newUser = await User.create({
        name,
        email,
        username,
        password:hashedPassword
     });
      generateToken(newUser._id, res);
           return res.status(201).json({
            _id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            username:newUser.username,
            bio:newUser.bio,
            profilePic:newUser.profilePic,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const signin=async(req,res)=>{
    try {
    const { username, password } = req.body
    if(!username || !password){
      return res.status(400).json({
        message:"All Fields are required"
    })
    }
    const user = await User.findOne({username})
    const passCompare = bcrypt.compare(password,user?.password || "")
    if(!user || !passCompare){
        return res.status(400).json({
            message:"Invalid Username & Password"
        })
    }
     generateToken(user._id, res);
   res.status(200).json({
    _id:user._id,
    name:user.name,
    email:user.email,
    username:user.username,
    bio:user.bio,
    profilePic:user.profilePic,
   })
   
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const logout=async(req,res)=>{
   try {
     res.cookie("jwt","",{maxAge:1})
     res.status(200).json({message:"User Logged Out Successfully"})
   } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
   }
}


export const followUnfollowUser =async(req,res)=>{
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)
    if(id === req.user._id.toString()){
        return res.status(400).json({
            message:"You cannot follow unfollow yourself"
        })
    }

    if(!userToModify || !currentUser){
        return res.status(400).json({
            message:"User Not found"
        })
    }
    const isFollowing = currentUser.following.includes(id)
    if(isFollowing){
        await User.findByIdAndUpdate(id,{$pull :{followers: req.user._id}})
        await User.findByIdAndUpdate(req.user._id, {$pull : {following: id}})
        res.status(200).json({message:"User unfollowed Successfully"})
    }else{
        await User.findByIdAndUpdate(id,{$push :{followers: req.user._id}})
        await User.findByIdAndUpdate(req.user._id, {$push : {following: id}})
        res.status(200).json({message:"User followed Successfully"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}


export const updateUser = async(req,res)=>{
    const { name, email, username, password, bio} = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id
   try {
     let user = await User.findById(userId)
     if(!user) return res.status(400).json({message:"User not found"})
     if(req.params.id !== userId.toString()){
        return res.status(500).json({message:"You cannot Update Other Users Profile"})
     }
     if(password){
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword 
     }
     if(profilePic){
      if(user.profilePic){
        await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0])
      }
      const uploadToResponse = await cloudinary.uploader.upload(profilePic)
      profilePic = uploadToResponse.secure_url
     }
     user.name = name || user.name;
     user.email = email || user.email;
     user.username = username || user.username;
     user.profilePic = profilePic || user.profilePic;
     user.bio = bio || user.bio;
     user = await user.save()
      await Post.updateMany(
        {'replies.userId':userId},
        {
          $set:{
            'replies.$[reply].username':user.username,
            'replies.$[reply].userProfilePic':user.profilePic
          }
        },{
          arrayFilters:[{'reply.userId':userId}]
        }
      )
     user.password = null
     res.status(200).json(user)
   } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
   }
}


export const getUsersProfile =async(req,res)=>{
    const { query } = req.params
  try {
     let user;
     if(mongoose.Types.ObjectId.isValid(query)){
      user = await User.findOne({_id:query}).select("-password").select("-updatedAt")
     }else{
      user = await User.findOne({username:query}).select("-password").select("-updatedAt")
     }
    if(!user) return res.status(400).json({message:"User not found"})
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error",error})
  }
}