import User from "../model/usermodel.js"
import Notification from "../model/notification.js"
import bcryptjs from "bcryptjs"
import cloudinary from "cloudinary"
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
  export const  updateProfile =async(req,res)=>{
       const {username,email,firstname,current_password,new_password,bio,profile,link,coverimage}=req.body
        const user =req.user
       if(!current_password &&new_password)
       {
        res.status(400).json({err:"entrer please enter current password"})

       }
       if(current_password &&new_password){
            
            const iscorrect = await bcryptjs.compare(new_password,current_password)
            if (iscorrect){
                 const salt=await bcryptjs.genSalt(10)
                 const hash =await bcryptjs.hash(new_password,salt)


            }

       }
       user.username=(username || user.username)
       user.email=(email || user.email )
       user.firstname=(firstname || user.firstname)
       user.bio=(bio|| user.bio)
       user.profile=(profile|| user.profile)
       user.link=(link || user.link)
      /* if(profile){
        if (user.profile)
        {
            const secure_url= user.profile.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(secure_url)
        }
             const upload=cloudinary.uploader.upload(profile)
             user.profile=upload.secure_url
       }
       if(coverimage){
        if (user.coverimage)
        {
            const secure_url= user.coverimage.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(secure_url)
        }
             const upload=cloudinary.uploader.upload(coverimage)
             user.profile=upload.secure_url
       }
             */
       await user.save()
       res.status(200).json({
          user
       })
       

  }
