import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import baseUrl from "../../constant/baseUrl";
import axios from "axios";
import useFollow from "../../hooks/useFollow";
import { useState } from "react";

const RightPanel = () => {
	const { data: authUser } = useQuery({ queryKey: ["authData"] });
	const [hoveredUser, setHoveredUser] = useState(null);
	const {data:user,isLoading}=useQuery({
		queryKey:['suggestion'],
		queryFn:async ()=>{
			const res = await axios.get(`${baseUrl}/api/user/suggestion`,{
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				withCredentials:true
			})
			return res.data
		}
	})
	const {follow} = useFollow()

	return (
		<div className='hidden text-white lg:block bg-black h-screen overflow-hidden'>
			<div className='h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 p-4'>
				{/* Who to Follow Section */}
				<div className='bg-gradient-to-br from-[#16181C] to-[#1a1d23] p-6 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-sm mb-4'>
				<div className='flex items-center gap-3 mb-6'>
					<div className='w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full'></div>
					<h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
						Who to follow
					</h2>
				</div>
				
				<div className='space-y-4'>
					{isLoading && (
						<div className='space-y-4'>
							{[...Array(4)].map((_, i) => (
								<div key={i} className='animate-pulse'>
									<RightPanelSkeleton />
								</div>
							))}
						</div>
					)}
					
					{!isLoading && user?.map((userItem) => (
						<div
							key={userItem._id}
							className='group relative'
							onMouseEnter={() => setHoveredUser(userItem._id)}
							onMouseLeave={() => setHoveredUser(null)}
						>
							<Link
								to={`/profile/${userItem.username}`}
								className={`block p-4 rounded-xl transition-all duration-300 border ${
									hoveredUser === userItem._id 
										? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 transform scale-[1.02] shadow-lg' 
										: 'bg-gray-800/20 border-gray-700/50 hover:border-gray-600/50'
								}`}
							>
								<div className='flex items-center justify-between'>
									<div className='flex gap-3 items-center flex-1 min-w-0'>
										<div className='relative group-hover:scale-110 transition-transform duration-300'>
											<div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5'>
												<img 
													src={userItem.profile || "/avatar-placeholder.png"} 
													alt={`${userItem.firstname}'s avatar`}
													className='w-full h-full rounded-full object-cover bg-gray-800'
												/>
											</div>
											<div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#16181C] opacity-80'></div>
										</div>
										
										<div className='flex flex-col min-w-0 flex-1'>
											<span className='font-semibold text-white text-base tracking-tight truncate group-hover:text-blue-400 transition-colors duration-300'>
												{userItem.firstname}
											</span>
											<span className='text-sm text-slate-400 truncate group-hover:text-slate-300 transition-colors duration-300'>
												@{userItem.username}
											</span>
										</div>
									</div>
									
									<button
										className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform active:scale-95 ${
											hoveredUser === userItem._id
												? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25'
												: 'bg-white text-black hover:bg-gray-100'
										} hover:scale-105 shadow-md`}
										onClick={(e) => {
											e.preventDefault();
											follow(userItem._id);
										}}
									>
										<span className='flex items-center gap-2'>
											<span>Follow</span>
											<span className='text-xs'>+</span>
										</span>
									</button>
								</div>
							</Link>
						</div>
					))}
				</div>
				
				{!isLoading && user?.length === 0 && (
					<div className='text-center py-8'>
						<div className='text-gray-500 text-sm'>
							<div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center'>
								<span className='text-2xl'>👥</span>
							</div>
							No suggestions available
						</div>
					</div>
				)}
				
				<div className='mt-6 pt-4 border-t border-gray-700/30'>
					<Link 
						to='/explore' 
						className='text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300 hover:underline'
						onClick={(e) => {
                            if (!authUser) {
                                e.preventDefault();
                                toast.error("Please login to view more");
                            }
                        }}
					>
						Show more →
					</Link>
				</div>
				</div>
				
				{/* Trending Section - You can add more sections here */}
				<div className='bg-gradient-to-br from-[#16181C] to-[#1a1d23] p-6 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-sm mb-4'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='w-1 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full'></div>
						<h3 className='text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
							🔥 What's happening
						</h3>
					</div>
					<div className='space-y-3'>
						<div className='p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300'>
							<p className='text-sm text-gray-300'>Trending in Technology</p>
							<p className='font-semibold text-white'>#ReactJS</p>
							<p className='text-xs text-gray-500'>42.1K posts</p>
						</div>
						<div className='p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300'>
							<p className='text-sm text-gray-300'>Trending</p>
							<p className='font-semibold text-white'>#WebDevelopment</p>
							<p className='text-xs text-gray-500'>28.3K posts</p>
						</div>
						<div className='p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300'>
							<p className='text-sm text-gray-300'>Technology · Trending</p>
							<p className='font-semibold text-white'>#JavaScript</p>
							<p className='text-xs text-gray-500'>15.7K posts</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
