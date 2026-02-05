import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";
import toast from "react-hot-toast";
import { HiDotsVertical } from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
axios.defaults.maxContentLength = 5 * 1024 * 1024; // 5MB response limit
axios.defaults.maxBodyLength = 5 * 1024 * 1024;


const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const [isHovered, setIsHovered] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const {data:authData }=useQuery({
		queryKey:['authData']
	})
	const queryClient=useQueryClient()
	const postOwner = post.user;
	const isLiked = authData?.likedPosts?.includes(post._id) || false;

	const isMyPost = authData && post.user._id.toString() === authData._id.toString();

	const formattedDate = post?.createdAt 
		? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
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
			queryClient.invalidateQueries(["getPosts"]); 
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
			queryClient.invalidateQueries(["getPosts"]); 
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
	  queryClient.invalidateQueries(["getPosts"]);
	  setComment(""); // Clear comment input
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
		if (!authData) return toast.error("Please login to like posts");
		if (!isMyPost){
          likePost(likeData)

		}
	};

	return (
		<article 
			className={`group relative bg-black border-b border-gray-800 p-4 transition-all duration-300 hover:bg-gray-900/30 ${
				isHovered ? '' : ''
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Post Header */}
			<header className='flex items-start gap-3 mb-3'>
				{/* Avatar */}
				<Link to={`/profile/${postOwner.username}`} className='group/avatar relative'>
					<div className='w-10 h-10 rounded-full overflow-hidden'>
						<img 
							src={postOwner.profile || "/avatar-placeholder.png"} 
							alt={`${postOwner.firstname}'s avatar`}
							className='w-full h-full object-cover bg-gray-800'
						/>
					</div>
				</Link>

				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 flex-wrap'>
						<Link 
							to={`/profile/${postOwner.username}`} 
							className='font-bold text-white hover:text-blue-400 transition-colors duration-300'
						>
							{postOwner.firstname}
						</Link>
						
						<span className='text-gray-400 text-sm flex items-center gap-2'>
							<Link 
								to={`/profile/${postOwner.username}`}
								className='hover:text-gray-300 transition-colors duration-300'
							>
								@{postOwner.username}
							</Link>
							<span className='w-1 h-1 bg-gray-500 rounded-full'></span>
							<time className='hover:text-gray-300 transition-colors duration-300' title={new Date(post.createdAt).toLocaleString()}>
								{formattedDate}
							</time>
						</span>
					</div>
				</div>

				{/* More options dropdown */}
				<div className='relative'>
					<button
						className='p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-white'
						onClick={() => setShowDropdown(!showDropdown)}
					>
						<HiDotsVertical className='w-4 h-4' />
					</button>
					
					{showDropdown && (
						<div className='absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden'>
							{isMyPost && (
								<button
									className='flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors duration-200'
									onClick={() => {
										handleDeletePost();
										setShowDropdown(false);
									}}
								>
									<FaTrash className='w-4 h-4' />
									<span className='text-sm font-medium'>Delete Post</span>
								</button>
							)}
						</div>
					)}
				</div>
			</header>

			{/* Post Content */}
			<div className='mb-4'>
				{post.text && (
					<p className='text-white text-[15px] leading-relaxed mb-3 whitespace-pre-wrap'>
						{post.text}
					</p>
				)}
				
				{post.img && (
					<div className='relative group/image overflow-hidden rounded-xl border border-gray-800 bg-black'>
						<div className='flex justify-center items-center w-full'>
							<img
								src={post.img}
								alt='Post image'
								className='max-w-full max-h-[550px] object-contain'
							/>
						</div>
					</div>
				)}
			</div>
			{/* Engagement Actions */}
			<footer className='flex items-center justify-between mt-2'>
				<div className='flex items-center gap-8'>
					{/* Comments */}
					<button
						className='group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-500/10 transition-all duration-300'
						onClick={() => {
							if (!authData) return toast.error("Please login to comment");
							document.getElementById("comments_modal" + post._id).showModal();
						}}
					>
						<FaRegComment className='w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300' />
						<span className='text-sm font-medium text-gray-400 group-hover:text-blue-400 transition-colors duration-300'>
							{post.comments.length}
						</span>
					</button>

					{/* Repost */}
					<button className='group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-green-500/10 transition-all duration-300'>
						<BiRepost className='w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors duration-300' />
						<span className='text-sm font-medium text-gray-400 group-hover:text-green-400 transition-colors duration-300'>0</span>
					</button>

					{/* Like */}
					<button 
						className='group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-pink-500/10 transition-all duration-300'
						onClick={handleLikePost}
					>
						{isLiked ? (
							<FaHeart className='w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform duration-300' />
						) : (
							<FaRegHeart className='w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors duration-300' />
						)}
						<span className={`text-sm font-medium transition-colors duration-300 ${
							isLiked ? 'text-pink-500' : 'text-gray-400 group-hover:text-pink-500'
						}`}>
							{post.likes.length}
						</span>
					</button>
				</div>

				{/* Bookmark */}
				<button className='group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-yellow-500/10 transition-all duration-300'>
					<FaRegBookmark className='w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300' />
				</button>
			</footer>

			{/* Enhanced Comments Modal */}
			<dialog id={`comments_modal${post._id}`} className='modal'>
				<div className='modal-box bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl'>
					<div className='flex items-center justify-between mb-6'>
						<h3 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
							💬 Comments
						</h3>
						<button 
							className='btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white'
							onClick={() => document.getElementById(`comments_modal${post._id}`).close()}
						>
							✕
						</button>
					</div>
					
					{/* Comments List */}
					<div className='max-h-80 overflow-y-auto mb-6 space-y-4'>
						{post.comments.length === 0 ? (
							<div className='text-center py-8'>
								<div className='text-6xl mb-4'>💭</div>
								<p className='text-gray-400 text-lg'>No comments yet</p>
								<p className='text-gray-500 text-sm'>Be the first to share your thoughts!</p>
							</div>
						) : (
							post.comments.map((commentItem) => (
								<div key={commentItem._id} className='flex gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300'>
									<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5'>
										<img
											src={commentItem.user.profile || "/avatar-placeholder.png"}
											alt="Commenter avatar"
											className='w-full h-full rounded-full object-cover bg-gray-800'
										/>
									</div>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-1'>
											<span className='font-semibold text-white'>{commentItem.user?.firstname}</span>
											<span className='text-gray-400 text-sm'>@{commentItem.user?.username}</span>
										</div>
										<p className='text-gray-300 leading-relaxed'>{commentItem.text}</p>
									</div>
								</div>
							))
						)}
					</div>

					{/* Comment Form */}
					<form onSubmit={handlePostComment} className='border-t border-gray-700/50 pt-6'>
						<div className='flex gap-3'>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5'>
								<img
									src={authData?.profile || "/avatar-placeholder.png"}
									alt="Your avatar"
									className='w-full h-full rounded-full object-cover bg-gray-800'
								/>
							</div>
							<div className='flex-1'>
								<textarea
									className='w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500/50 transition-colors duration-300'
									placeholder='Write a thoughtful comment...'
									rows={3}
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<div className='flex justify-between items-center mt-3'>
									<span className='text-sm text-gray-500'>{comment.length}/280</span>
									<button 
										type="submit"
										className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
											comment.trim().length > 0
												? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105'
												: 'bg-gray-700 text-gray-400 cursor-not-allowed'
										}`}
										disabled={comment.trim().length === 0}
									>
										{isCommenting ? (
											<div className='flex items-center gap-2'>
												<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
												<span>Posting...</span>
											</div>
										) : (
											'Comment'
										)}
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</article>
	);
};
export default Post;
