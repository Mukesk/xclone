import Notification from "../model/notification.js";

export const showNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch notifications for the user
    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate("from", "username profile"); // ✅ Fixed fromUser -> from

    if (!notifications.length) {
      return res.status(200).json({ message: "No new notifications." });
    }

    // Mark notifications as read AFTER sending the response
    await Notification.updateMany(
      { to: userId, read: false }, // ✅ Only update unread notifications
      { $set: { read: true } }
    );

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error showing notifications:", err);
    res.status(500).json({ Err: `Error in showing notifications: ${err.message}` });
  }
};




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