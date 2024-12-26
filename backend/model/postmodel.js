import mongoose from "mongoose";
const postScheme =new mongoose.Schema({
    img:{
        type:String,
       
        
    }
    ,user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
    ,text:{
        type:String,
       
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            default:[]
        }
        

    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            default:[]
        }
    ]
})
const Post = mongoose.model("Posts",postScheme)
export default Post