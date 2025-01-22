import Post from "../model/postmodel.js"
import cloudinary from "cloudinary"
import Notification from "../model/notification.js"
import User from "../model/usermodel.js"
export const createPost =async(req,res)=>{
   try{
     var {text,img}=req.body
     const userId =req.user._id.toString()
     if(text||img){
     if(img){
     const uploadImg=cloudinary.UploadStream.upload(img)
     const img=uploadImg.secure_url
     }

     const post = new Post({
        user:userId,
        text,
         img

     })
    await post.save()
     res.status(200).json(post)
   }
   }
   catch(err){

        res.status(400).json({"Err":"err in creating post"})
   }


}
export const deletePost =async(req,res)=>{
   const reqid=  req.params
   if (!reqid.id){
      res.status(400).json({err:"post id is not exists"})

   }
   const post =  await Post.findOne({_id:reqid.id})
   const userId=req.user._id.toString()
   if (userId==(post.user._id.toString())){
       await Post.findOneAndDelete({_id:reqid.id})
       res.status(200).json({success:"post is deleted"})
   }
   else{
      res.status(400).json({err:"post id and userid is not match"})
   }
   

}
export const likeUnlike= async (req,res)=>{
   try{
    const {id} = req.params
    const post = await Post.findOne({_id:id})
    const user = await User.findOne({_id:req.user.id})
    if(!post){
      res.status(400).json({"err ":" does not exists post"})
    }
    if((req.user._id.toString())==(post.user._id.toString())){
      res.status(400).json({"err ":"you can't like your post"})
    }
    if (post.likes.includes(req.user._id)||user.likedPosts.includes(id)){

       post.likes=  post.likes.filter((val)=>{val._id.toString()!=req.user.id.toString()}) 
       user.likedPosts= user.likedPosts.filter((values)=>{values._id.toString()!=id})
       await post.save()
       await user.save()
       
      res.status(200).json({"sucess":"unliked post"})
      
    }
    else{
      post.likes.push(req.user._id)
      user.likedPosts.push(post._id)
     
      const  likeNotification =new Notification({
         from:req.user._id,
         to:post.user._id,
         type:"like"


      })
      await likeNotification.save()
      await user.save()
      res.status(200).json({"sucess":"liked post"})

      
    }
   }
   catch(err){
      res.status(400).json({"err ":" error in liking post"})

   }


}
export const likedPost=async(req,res)=>{
   try{
   const {id}= req.params;
   const posts=Post.find({likes:{$in:[id]}}
   )
   res.status(200).json(posts)

   



   }catch(err){
       res.status(500).json({err:`errror in gettting liked post${err}`})

   }
 }

 export const forYou =async(req,res)=>{
  try{
  const userId =req.user.id
   const feedPosts = await Post.find().sort({createdAt:-1}).populate({
    path:"user",
    select:"-password"
   })
   res.status(200).json(feedPosts)

 }
 catch(err){
  res.status(500).json({err:`errror in gettting foryou post${err}`})
 }
}
 export const followingPost = async (req, res) => {
   try {
     const userId = req.user._id;
 
     // Fetch the logged-in user
     const user = await User.findById(userId);
 
     if (!user) {
       return res.status(404).json({ error: "User not found." });
     }
 
     const following = user.following; // List of followed users' IDs
 
     // Fetch posts from followed users, sorted by creation time
     const feedPosts = await Post.find({ user: { $in: following } })
       .sort({ createdAt: -1 })
       .populate({
         path: "user", // Assuming 'user' is the field in Post schema
         select: "-password", // Exclude sensitive fields
       })
       .populate({
         path: "comments.user", // Assuming 'comments.user' is nested in Post schema
         select: "-password", // Exclude sensitive fields
       });
 
     res.status(200).json(feedPosts);
   } catch (err) {
     console.error(err); // Log the error for debugging
     res.status(500).json({ error: "An error occurred while retrieving the feed posts." });
   }
 };
 
 export const getallPost= async(req,res)=>{
          
  try{
    const userId =req.user._id
    const likePost= await Post.find({user:userId}).sort({createdAt:-1}).populate({
      path:"user",
      select:["-password","-email","-link","-bio"]
    }).populate({
      path:"comment.user",
      select:["-password","-email","-link","-bio"]
    })
   res.status(200).json(likePost)
   
  }
  catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while retrieving the liked posts." });
  }

 }
 export const getLikedpost=async(req,res)=>{
  try{
  const userId =req.user._id
  const postliked= req.user.likedPosts
  const likePost= await Post.find({_id:{$in:postliked}}).sort({createdAt:-1}).populate({
    path:"user",
    select:["-password","-email","-link","-bio"]
  }).populate({
    path:"comments.user",
    select:["-password","-email","-link","-bio"]
  })
 res.status(200).json(likePost)
 
}
catch (err) {
  console.error(err); // Log the error for debugging
  res.status(500).json({ error: "An error occurred while retrieving the liked posts." });
}
};



