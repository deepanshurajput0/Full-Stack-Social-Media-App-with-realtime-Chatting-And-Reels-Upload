import mongoose from "mongoose";

export const connectDb =async()=>{
   try {
     await mongoose.connect(process.env.MONGO_URL)
     console.log('Database Connected Successfully')
   } catch (error) {
    console.log( `Error while connecting Db ${error}`)
   }
}



