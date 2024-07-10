import jwt from "jsonwebtoken"
import User from "../Models/userModel.js"

export const authMiddleware=async(req,res,next)=>{
    try {
       const token = req.cookies.jwt
       if(!token){
        return res.status(401).json({message:"unauthorized"})
       }  
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userID).select('-password');
      req.user = user

      next() 

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}