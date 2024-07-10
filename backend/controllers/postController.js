import User from "../Models/userModel.js"
import Post from "../Models/postModel.js"
import { v2 as cloudinary } from "cloudinary"
export const createPost =async(req,res)=>{
  try {
    const { postedBy, text} = req.body

    let { img } = req.body
    if(!postedBy || !text){
        return res.status(400).json({message:"text fields are required"})
    }
    const user = await User.findById(postedBy);
    if(!user){
        return res.status(404).json({message:"User Not found"})
    }
    if(user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({message:"Unauthorized to create post"})
    }
    const maxLength = 500;
    if(text.length > maxLength){
        return res.status(400).json({message:`Text must be less than ${maxLength} characters`})
    }
    if(img){
      const uploadedResponse = await cloudinary.uploader.upload(img)
      img = uploadedResponse.secure_url
    }
    const newPost = new Post({postedBy, text, img})
    await newPost.save()
    res.status(200).json(newPost)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}


export const getPost =async(req,res)=>{
   try {
    const post = await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message:"Post not found"})
    }
     res.status(200).json(post)
   } catch (error) {
    console.log(error)
     res.status(500).json({message:"Internal Server Error"})
   }
}

export const deletePost =async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message:"Post not found"})
    }
    if(post.postedBy.toString() !== req.user._id.toString()){
        return res.status(401).json({message:"Unauthorized to delete a post"}) 
    }
    if(post.img){
      const imgId = post.img.split('/').pop().split(".")[0]
      await cloudinary.uploader.destroy(imgId)
    }
    await Post.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"Post deleted successfully"})

  } catch (error) {
    console.log(error)
     res.status(500).json({message:"Internal Server Error"})
  }
}

export const likeAndUnlike =async(req,res)=>{
    try {
       const { id:postId } = req.params
       const userId = req.user._id
       const post = await Post.findById(postId)
       if(!post){
        return res.status(400).json({message:"Post Not found"}) 
       } 
       const userLikedPost = post.likes.includes(userId)
       if(userLikedPost){
        await Post.updateOne({_id:postId},{$pull :{likes: userId}})
        res.status(200).json({message:"Post unLiked Successfully"})
       }else{
         post.likes.push(userId)
         await post.save()
         res.status(200).json({message:"Post liked successfully"})
       }
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Internal Server Error"})
    }
}


export const replyToPost =async(req,res)=>{
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id
        const userProfilePic = req.user.profilePic;
        const username = req.user.username
        if(!text){
           return res.status(400).json({message:"Text field is required"})
        }
        const post = await Post.findById(postId)
        if(!post){
           return res.status(404).json({message:"Post Not found"})

        } 
        const reply = {userId, text, userProfilePic, username}
        post.replies.push(reply)
        await post.save()
        res.status(200).json(reply)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})  
    }
}

export const getUserPosts=async(req,res)=>{
  const { username } = req.params
  try {
    const user = await User.findOne({username})
    if(!user){
      return res.status(404).json({error:"User Not Found"})
    }
    const posts = await Post.find({postedBy:user._id}).sort({createdAt:-1})
    res.status(200).json(posts)
  } catch (error) {
    res.status(200).json({message:error})
  }
}

export const getFeedPosts =async(req,res)=>{
    try {
      const userId = req.user._id
      const user = await User.findById(userId)
      if(!user){
        return res.status(404).json({message:"User not found"})
      } 
      const following = user.following
      const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt:-1})
      res.status(200).json(feedPosts) 
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})    
    }
}