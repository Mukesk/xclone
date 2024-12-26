
import Mongoose from "mongoose"

const noficationScheme = new Mongoose.Schema({
    from:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    to:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
   
    },
    type:{
        type:String,
        required:true,
        enum:["follow","like"]
    },
    read:{
        type:Boolean,
        default:false

    },

     
},{timestamps:true})
const Notification = Mongoose.model("Notification",noficationScheme)
export default Notification
