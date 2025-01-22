import Notification from "../model/notification.js"
export const showNotification= async( req,res )=>{
    try{

    const userId= req.user._id 
    const notifi = await Notification.find({to:userId}).sort({createdAt:-1})
    await Notification.updateMany({to:userId},{read:true});

    res.status(200).json(notifi)
    }
    catch(err){
        res.status(500).json({"Err":`error im showing notification ${err}`})
    }


}
export const  deleteNotification =async(req,res)=>{
    try{

    
    const userId= req.user._id 

    await Notification.deleteMany({to:userId }) 
    res.status(200).json({"success":"succes fully delete  notification"})
    }
    catch(err){
        res.status(500).json({"Err":`error im deleting notification ${err}`})
    }



}