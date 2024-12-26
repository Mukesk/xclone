import Post from "../model/postmodel.js"
import cloudinary from "cloudinary"
export const createPost =(req,res)=>{
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
     post.save()
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