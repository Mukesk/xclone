import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";
import { HiSparkles } from "react-icons/hi2";
import { BsGlobe2 } from "react-icons/bs";

const CreatePost = () => {
	const queryClient=useQueryClient()
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [isFocused, setIsFocused] = useState(false);

	const imgRef = useRef(null);

	const {data:user} =useQuery({
		queryKey:['authUser']
	})


	const data = {
		profileImg: user?.profile,
	};
	const {mutate:createPost,data:createdData, isPending , isError }= useMutation({
		mutationFn: async ({ text, img }) => {
		  try {
			const res = await axios.post(
			  `${baseUrl}/api/post/create`,
			  { text, img },
			  {
				headers: {
				  "Content-Type": "application/json",
				  "Accept": "application/json",
				},
				withCredentials: true, // Correctly placed here
			  }
			);
			return res.data;
		  } catch (error) {
			throw new Error(error.response?.data?.message || "Failed to create post");
		  }
		},
		onSuccess: () => {
		 // Refresh post list after success
		  setImg("");
		  setText("");
		   queryClient.invalidateQueries(["posts"]); 
		},
		onError: (error) => {
		  console.error("Post creation failed:", error.message);
		},
	  });
	

	

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text,img})
		
	};             

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl mx-4 mt-4 p-6 transition-all duration-300 ${
			isFocused ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'hover:border-gray-600/50'
		}`}>
			{/* Header with sparkles */}
			<div className='flex items-center gap-2 mb-4'>
				<HiSparkles className='w-5 h-5 text-blue-400' />
				<h3 className='text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
					What's happening?
				</h3>
			</div>

			<div className='flex items-start gap-4'>
				{/* Avatar with glow effect */}
				<div className='relative group'>
					<div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5'>
						<img 
							src={data.profileImg || "/avatar-placeholder.png"} 
							alt="Your avatar"
							className='w-full h-full rounded-full object-cover bg-gray-800'
						/>
					</div>
					<div className='absolute inset-0 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
				</div>

				{/* Main form */}
				<form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
					{/* Text area container */}
					<div className={`relative transition-all duration-300 ${
						isFocused ? 'transform scale-[1.01]' : ''
					}`}>
						<textarea 
							className={`w-full bg-transparent text-white text-xl placeholder-gray-400 resize-none border-none focus:outline-none min-h-[120px] transition-all duration-300 ${
								isFocused ? 'placeholder-gray-300' : ''
							}`}
							placeholder='Share your thoughts with the world...'
							value={text}
							onChange={(e) => setText(e.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
						/>
						{/* Character counter */}
						{text.length > 0 && (
							<div className='absolute bottom-2 right-2 text-xs text-gray-500'>
								{280 - text.length} characters left
							</div>
						)}
					</div>

					{/* Image preview */}
					{img && (
						<div className='relative group overflow-hidden rounded-2xl border border-gray-700/50 max-w-md'>
							<button
								type="button"
								className='absolute top-3 right-3 z-10 bg-black/80 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/80'
								onClick={() => {
									setImg(null);
									imgRef.current.value = null;
								}}
							>
								<IoCloseSharp className='w-4 h-4' />
							</button>
							<img 
								src={img} 
								alt="Preview"
								className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300' 
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
						</div>
					)}

					{/* Controls */}
					<div className='flex justify-between items-center pt-4 border-t border-gray-700/30'>
						{/* Left side tools */}
						<div className='flex items-center gap-4'>
							<button
								type="button"
								className='group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-500/10 transition-all duration-300'
								onClick={() => imgRef.current.click()}
							>
								<CiImageOn className='w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300' />
								<span className='text-sm text-gray-400 group-hover:text-gray-300 hidden sm:block'>Photo</span>
							</button>
							
							<button
								type="button"
								className='group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-yellow-500/10 transition-all duration-300'
							>
								<BsEmojiSmileFill className='w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300' />
								<span className='text-sm text-gray-400 group-hover:text-gray-300 hidden sm:block'>Emoji</span>
							</button>
							
							<div className='flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10'>
								<BsGlobe2 className='w-4 h-4 text-green-400' />
								<span className='text-sm text-green-400 font-medium'>Everyone can reply</span>
							</div>
						</div>

						{/* Right side actions */}
						<div className='flex items-center gap-3'>
							{text.length > 0 && (
								<div className={`w-8 h-8 rounded-full border-2 relative ${
									text.length > 280 ? 'border-red-500' : text.length > 250 ? 'border-yellow-500' : 'border-blue-500'
								}`}>
									<div className={`absolute inset-0.5 rounded-full bg-gradient-to-r ${
										text.length > 280 ? 'from-red-500 to-red-600' : text.length > 250 ? 'from-yellow-500 to-yellow-600' : 'from-blue-500 to-purple-600'
									}`} 
									style={{transform: `scaleX(${Math.min(text.length / 280, 1)}) scaleY(${Math.min(text.length / 280, 1)})`}}
									></div>
								</div>
							)}
							
							<button 
								type="submit"
								className={`group relative px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 transform ${
									(text.trim() || img) && !isPending
										? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25 active:scale-95'
										: 'bg-gray-700 cursor-not-allowed'
								}`} 
								disabled={(!text.trim() && !img) || isPending || text.length > 280}
							>
								{isPending ? (
									<div className='flex items-center gap-2'>
										<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
										<span>Posting...</span>
									</div>
								) : (
									<span className='flex items-center gap-2'>
										<span>Post</span>
										<HiSparkles className='w-4 h-4 group-hover:rotate-12 transition-transform duration-300' />
									</span>
								)}
							</button>
						</div>
					</div>

					{/* Hidden file input */}
					<input 
						type='file' 
						accept='image/*' 
						hidden 
						ref={imgRef} 
						onChange={handleImgChange} 
					/>

					{/* Error message */}
					{isError && (
						<div className='flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400'>
							<span className='text-sm'>⚠️ Something went wrong. Please try again.</span>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
export default CreatePost;
