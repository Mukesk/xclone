import Post from "../model/postmodel.js";
import cloudinary from "../config/cloudinary.js";
import Notification from "../model/notification.js";
import User from "../model/usermodel.js";

import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory before uploading

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;

export const createPost = async (req, res) => {
  try {
    let { text, img } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or an image" });
    }

    // 🔥 Log the incoming request
    console.log("Received post request:", { text, imgLength: img ? img.length : 0 });

    if (img) {
      if (!img.startsWith("data:image")) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      // 🔥 Log before Cloudinary upload
      console.log("Uploading to Cloudinary...");

      const uploadImg = await cloudinary.uploader.upload(img, { folder: "posts" });

      console.log("Upload success:", uploadImg.secure_url);
      img = uploadImg.secure_url;
    }

    // Save post
    const post = new Post({ user: userId, text, img });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};


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
export const likeUnlike = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(req.user.id);

    if (!post) {
      return res.status(400).json({ error: "Post does not exist" });
    }

    if (req.user._id.toString() === post.user._id.toString()) {
      return res.status(400).json({ error: "You can't like your own post" });
    }

    // Unlike logic
    if (post.likes.includes(req.user._id) || user.likedPosts.includes(id)) {
      post.likes = post.likes.filter((val) => val.toString() !== req.user._id.toString());
      user.likedPosts = user.likedPosts.filter((val) => val.toString() !== id);

      await post.save();
      await user.save();

      return res.status(200).json({ success: "Unliked post" });
    }

    // Like logic
    post.likes.push(req.user._id);
    user.likedPosts.push(post._id);

    // 🔥 Include `post: post._id`
    const likeNotification = new Notification({
      from: req.user._id,
      to: post.user._id,
      post: post._id,  // ✅ Add the post ID here
      type: "like",
    });

    await likeNotification.save();
    await user.save();
    await post.save();

    return res.status(200).json({ success: "Liked post" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error in liking/unliking post" });
  }
};
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Check if comment is not empty
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Find post and user
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add comment
    post.comments.push({ text: comment, user: {profile:user.profile,username:user.username,firstname:user.firstname}});

    // Save the post and populate the comments with user data
    await post.save();

    // Populate comments with user data and return the updated post
    const updatedPost = await Post.findById(id).populate({
      path: "comments.user",
      select: ["-password", "-email", "-link", "-bio"],
    });

    return res.status(200).json({ success: "Comment added", updatedPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error in commenting post" });
  }
};



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
      path:"comments.user",
      select:["-password","-email","-link","-bio"]
    })
   res.status(200).json(likePost)
   
  }
  catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while retrieving the liked posts." });
  }

 }


 export const getLikedpost = async (req, res) => {
   try {
     const userId = req.user._id;
     const postliked = req.user.likedPosts; // This is an array of post IDs
 
     // Fetch posts that match the liked post IDs
     const likePost = await Post.find({ _id: { $in: postliked } })
       .sort({ createdAt: -1 })
       .populate({
         path: "user",
         select: ["-password", "-email", "-link", "-bio"],
       })
       .populate({
         path: "comments.user",
         select: ["-password", "-email", "-link", "-bio"],
       });
 
     res.status(200).json(likePost);
   } catch (error) {
     console.error("Error fetching liked posts:", error);
     res.status(500).json({ message: "Failed to fetch liked posts" });
   }
 };
 

