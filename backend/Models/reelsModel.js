import mongoose from 'mongoose'

const reelSchema = new mongoose.Schema({
    ouruser:{
        type:String
    },
    profile:{
     type:String
    },
    caption:{
        type:String
    },
    reel:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[],
    },
    comments:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
            text:{
                type:String,
                required:true
            },
            userProfilePic:{
                type:String
            },
            username:{
                type:String
            }
    
        }
    ]
},{
    timestamps:true
})


const reelModel = mongoose.model('Reel',reelSchema)

export default reelModel





