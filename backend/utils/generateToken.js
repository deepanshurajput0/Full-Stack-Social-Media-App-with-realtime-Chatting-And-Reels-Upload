import jwt from "jsonwebtoken"
const generateToken=(userID,res)=>{
   const token =  jwt.sign({userID},process.env.JWT_SECRET,{
    expiresIn: '15d'
   })
   // console.log(token)
   res.cookie("jwt",token,{
    maxAge: 15*24*60*60*1000,
    sameSite:"strict"
   })
   return token
}

export default generateToken

