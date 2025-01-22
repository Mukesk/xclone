import mongoose from "mongoose";
const postScheme =new mongoose.Schema({
    img:{
        type:String,
       
        
    }
    ,user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
    ,text:{
        type:String,
       
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            default:[],
            ref:"User"
        }
        

    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            default:[],
            ref:"User"
        }
    ]
})
const Post = mongoose.model("Posts",postScheme)
export default Post