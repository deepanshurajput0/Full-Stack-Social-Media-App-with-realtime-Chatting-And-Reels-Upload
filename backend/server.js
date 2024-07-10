import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./db/connectDB.js"
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import messageRoutes from './routes/messageRoutes.js'
import reelsRoutes from './routes/reelsRoute.js'
import { v2 as cloudinary } from "cloudinary"
import cors from "cors"
import { app, server } from "./socket/socket.js"
import cookieParser from "cookie-parser"
import bodyParser from 'body-parser'
const PORT = process.env.PORT || 8000
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
connectDb()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.use('/api/users',userRoute)
app.use('/api/posts',postRoute)
app.use('/api/messages',messageRoutes)
app.use('/api/reels',reelsRoutes)
server.listen(PORT,()=>{
    console.log(`Server is running at ${PORT} Port`)
})