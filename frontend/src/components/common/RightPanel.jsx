import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";

import { useQuery } from "@tanstack/react-query";
import baseUrl from "../../constant/baseUrl";
import axios from "axios";
import useFollow from "../../hooks/useFollow";

const RightPanel = () => {
	const {data:user,isLoading}=useQuery({queryKey:['suggestion'],queryFn:async ()=>{
		const res = await axios.get(`${baseUrl}/api/user/suggestion`,{headers:{
			"Content-Type":"application/json",
			"Aceept":"application/json"
		},withCredentials:true})
		return res.data
	}

		

	})
	const {follow} = useFollow()

	return (
		<div className='hidden text-white lg:block bg-black  '>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						user?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profile || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold text-white tracking-tight truncate w-28'>
											{user.firstname}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {e.preventDefault();
											follow(user._id)
										}}
									>
										Follow
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
