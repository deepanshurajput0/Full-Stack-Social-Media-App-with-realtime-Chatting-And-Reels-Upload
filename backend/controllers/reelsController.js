import { v2 as cloudinary } from 'cloudinary'
import reelModel from '../Models/reelsModel.js'
import getDataUri from '../utils/dataUri.js'

export const createReelController =async(req,res)=>{
    try {
    const { caption } = req.body

    const file = req.file

    const fileUri = getDataUri(file)

    const user = req.user

     if(!caption || !file){
         res.status(401).json({
            message:'All Fields are required'
        })
     }
        const reelUpload = await cloudinary.uploader.upload(fileUri.content,{
            resource_type:'video',
            start_offset:'0',
            end_offset:'30'
        })
      const newReel = new reelModel({
        ouruser:user?.username,
        profile:user?.profilePic,
        caption,
        reel:{
           public_id:reelUpload.public_id,
           url:reelUpload.secure_url
        },
        
      })
      await newReel.save()
      res.status(200).json(newReel)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error",error})  
    }
}


export const getAllReels =async(req,res)=>{
   try {
    const reels = await reelModel.find({}).sort({createdAt:-1})
    res.status(200).json(reels)
   } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error",error})  
   }
}




export const Like =async(req,res)=>{
  try {
    const { id:postId } = req.params
    const userId = req.user._id
     const result = await reelModel.findByIdAndUpdate(postId,{
        $push:{likes:userId}
      },{
        new:true
      }) 
      res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}
export const Unlike =async(req,res)=>{
  try {
    const { id:postId } = req.params
    const userId = req.user._id
     const result = await reelModel.findByIdAndUpdate(postId,{
        $pull:{likes:userId}
      },{
        new:true
      }) 
      res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}


export const Comment =async(req,res)=>{
   try {
    const {id:reelId} = req.params
    const comment={
     userId:req.user._id,
     text:req.body.text,
     userProfilePic:req.user.profilePic,
     username:req.user.username
 
    }
    const result = await reelModel.findByIdAndUpdate(reelId,{
     $push:{comments:comment}
    },{
      new:true
    })
    res.status(200).json(result)
   } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
   }
}