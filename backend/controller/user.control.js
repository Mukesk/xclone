import User from "../model/usermodel.js"
import Notification from "../model/notification.js"
import bcryptjs from "bcryptjs"
import cloudinary from "../config/cloudinary.js"
import Post from "../model/postmodel.js"
export const searchProfile=async(req,res)=>{
    try{
       const {username}=req.params
       const suser=await User.findOne({username})
       if(!suser){
        res.status(400).json({err:"not valid profile"})
       }
       res.status(200).json(suser)

    }
 catch(err)
{
    res.status(500).json({err:"errror in searching profile"})
}
}
export const  followingRequest=async(req,res)=>{
    try{
        const {id}=req.params
        const suser=await User.findOne({_id:id})
        const cuser=await User.findOne({_id:req.user._id})
        if (suser._id.equals(cuser._id)) {
            return res.status(400).json({ err: "You cannot follow your own profile" });
          }
        if(!suser||!cuser){
            res.status(400).json({err:"not valid profile"})
           }
           const isfollowing= cuser.following.includes(id)
        if(isfollowing){
            await User.findByIdAndUpdate({_id:req.user._id},{$pull:{following: id}})
        await User.findByIdAndUpdate({_id:id},{$pull:{followers: req.user._id}})
        res.status(200).json({success:"unfollowed sucessfully"})

        }
        else{
            const newnofitication = new Notification({
                type:"follow",
                from:cuser._id,
                to:suser._id
            })
        await newnofitication.save()
           await User.findByIdAndUpdate({_id:req.user._id},{$push:{following: id}})
        await User.findByIdAndUpdate({_id:id},{$push:{followers: req.user._id}})

         res.status(200).json({success:"following sucessfully"})
        }
        
    }
 catch(err)
{
    res.status(500).json({err:`errror in following profile${err}`})
}

}
export const suggested = async (req, res) => {
    try {
      
      const userId = req.user._id;
  
     
      const users = await User.find().limit(10);
  
      
      const filteredUsers = users.filter(user => (!user.followers.includes(userId))&& (!user._id.equals(userId)) )
        
      
      // Limit the result to 4 users
      const suggestedUsers = filteredUsers.slice(0, 4);
  
      // Return the suggested users
      res.status(200).json(suggestedUsers);
    } catch (err) {
      res.status(500).json({ err: "Error in suggesting profiles" });
    }
  };

  

  
  export const updateProfile = async (req, res) => {
    try {
      const {
        username,
        email,
        firstname,
        current_password,
        new_password,
        bio,
        profile,
        link,
        coverimg,
      } = req.body;
  
      const user = req.user;
  
      // ✅ Debugging: Ensure user is being retrieved
      console.log("Current User Data:", user);
  
      if (!user) {
        return res.status(404).json({ err: "User not found" });
      }
  
      // ✅ Check if a new password is provided but the current one is missing
      if (!current_password && new_password) {
        return res.status(400).json({ err: "Please enter your current password" });
      }
  
      // ✅ If updating password, verify current password
      if (current_password && new_password) {
        const isCorrect = await bcryptjs.compare(current_password, user.password);
  
        console.log("Password Match:", isCorrect); // Debugging
  
        if (!isCorrect) {
          return res.status(400).json({ err: "Current password is incorrect" });
        }
  
        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(new_password, salt);
        user.markModified("password");
      }
  
      // ✅ Update user details
      user.username = username || user.username;
      user.email = email || user.email;
      user.firstname = firstname || user.firstname;
      user.bio = bio || user.bio;
      user.link = link || user.link;
  
      user.markModified("username");
      user.markModified("email");
      user.markModified("firstname");
      user.markModified("bio");
      user.markModified("link");
  
      // ✅ Handle profile image upload
      if (profile) {
        try {
          if (user.profile) {
            const secureUrl = user.profile.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(secureUrl);
          }
          const upload = await cloudinary.uploader.upload(profile);
          user.profile= upload.secure_url;
          console.log("Profile Image Uploaded:", user.profileImg);
          user.markModified("profileImg");
        } catch (error) {
          console.error("Cloudinary Profile Image Upload Error:", error);
          return res.status(500).json({ err: "Error uploading profile image" });
        }
      }
  
      // ✅ Handle cover image upload
      if (coverimg) {
        try {
          if (user.coverimg) {
            const secureUrl = user.coverimg.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(secureUrl);
          }
          const upload = await cloudinary.uploader.upload(coverimg);
          user.coverimg = upload.secure_url;
          console.log("Cover Image Uploaded:", user.coverimg);
          user.markModified("coverImg");
        } catch (error) {
          console.error("Cloudinary Cover Image Upload Error:", error);
          return res.status(500).json({ err: "Error uploading cover image" });
        }
      }
  
      // ✅ Save updates
      await user.save();
  
      // ✅ Send updated user data to frontend
      res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ err: "Internal server error" });
    }
  };
  