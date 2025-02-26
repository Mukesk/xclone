import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { use } from "react";
import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";
import toast from "react-hot-toast";
axios.defaults.maxContentLength = 5 * 1024 * 1024; // 5MB response limit
axios.defaults.maxBodyLength = 5 * 1024 * 1024;


const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const {data:authData }=useQuery({
		queryKey:['authData']
	})
	const queryClient=useQueryClient()
	const postOwner = post.user;
	const isLiked=authData.likedPosts.includes(post._id)

	const isMyPost = post.user._id.toString()===authData._id.toString();

	const formattedDate =  post?.createdAt
    ? new Date(post.createdAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata", 
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Unknown Date";
	



	const isCommenting = false;
	const {mutate:deletePost,data,isLoading}=useMutation({
		mutationFn:async ()=>{
			const res = await axios.delete(`${baseUrl}/api/post/delete/${post._id}`,{headers:{
				"Content-Type":"application/json"
			},withCredentials:true})
			return res.data				},
			onSuccess:()=>{
				toast.success("deleted post")
				queryClient.invalidateQueries(["posts"]); 
			}
	}

)
const {mutate:likePost,data:likeData}=useMutation({
	mutationFn:async ()=>{
		const res = await axios.post(`${baseUrl}/api/post/like/${post._id}`,{},{headers:{
			"Content-Type":"application/json"
		},withCredentials:true})
		return res.data				},
		onSuccess:()=>{
			toast.success("liked post")
			queryClient.invalidateQueries(["posts"]); 
			

		}
})
const { mutate: commentPost } = useMutation({
	mutationFn: async ({ comment }) => {
	  const res = await axios.post(
		`${baseUrl}/api/post/comment/${post._id}`,
		{ comment },
		{ headers: { "Content-Type": "application/json" }, withCredentials: true }
	  );
	  return res.data.post; // Return the updated post with populated comments
	},
	onSuccess: (updatedPost) => {
	  toast.success("Comment added successfully");
	  queryClient.setQueryData(["posts"], (oldData) => {
		return oldData.map((p) => (p._id === post._id ? updatedPost : p));
	  });
	},
  });
  


	const handleDeletePost = () => {
		if (isMyPost){
			
      deletePost(data)
			
		}
	};


	const handlePostComment = (e) => {
		e.preventDefault();
		commentPost({comment})


	};

	const handleLikePost = () => {
		if (!isMyPost){
          likePost(likeData)

		}
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded overflow-hidden'>
						<img className="w-8 " src={postOwner.profile || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.firstname}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex text-black gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profile || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user?.firstname}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user?.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;
