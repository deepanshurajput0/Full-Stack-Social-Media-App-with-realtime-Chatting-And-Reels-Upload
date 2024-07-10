import mongoose, { Mongoose } from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lastMessage:{
        text:String,
        sender:{type:mongoose.Schema.Types.ObjectId}
    }
},{timestamps:true})

const Conversation = mongoose.model('Conversation',conversationSchema)

export default Conversation

