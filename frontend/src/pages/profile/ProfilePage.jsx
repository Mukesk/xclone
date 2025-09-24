import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import baseUrl from "../../constant/baseUrl";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { HiSparkles, HiCamera } from "react-icons/hi2";
import { BsShieldCheck } from "react-icons/bs";
import useFollow from "../../hooks/useFollow";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";


const ProfilePage = () => {
    const [coverimg, setCoverImg] = useState(null);
    const [profileimg, setProfileImg] = useState(null);
    const [feedType, setFeedType] = useState("posts");
	const {follow,isPending:isFollowing}=useFollow();

	const toFollow=(id) =>{
		if(isFollowing) return
		follow(id)
	}
    const { username } = useParams();

    const coverImgRef = useRef(null);
    const profileImgRef = useRef(null);

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/user/profile/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw new Error("Failed to load user profile");
        }
    };

    const {mutate:updateData,data:updatedData}=useMutation({mutationFn:async({profileimg,coverimg})=>{
        const res= await axios.post(`${baseUrl}/api/user/updateProfile`,
            {profile: profileimg, coverimg
            },{headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        },withCredentials:true})
        return res.data
      
          },onSuccess:()=>{
          toast.success("Profile updated successfully!")
          // Clear the temp images after successful update
          setCoverImg(null);
          setProfileImg(null);
          // Refetch user data to show updated images
          refetch();
      }}
  )
    const { data: user, isLoading, isError,refetch } = useQuery({
        queryKey: ["userData", username],
        queryFn: fetchUserProfile,
        enabled: !!username,
    });
	useEffect(()=>{
		refetch()

	},[username,refetch])

    // Fetch authenticated user (current logged-in user)
    const { data: me } = useQuery({ queryKey: ["authData"] });
    const isMyProfile = me?._id === user?._id;

    // Handle Image Upload
    const handleImgChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (type === "coverImg") setCoverImg(reader.result);
            if (type === "profileImg") setProfileImg(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full text-white bg-black">
            {/* LOADING / ERROR HANDLING */}
            {isLoading && <ProfileHeaderSkeleton />}
            {isError && (
                <div className="flex flex-col items-center justify-center min-h-96 text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-red-400 text-xl mb-2">Oops! Something went wrong</p>
                    <p className="text-gray-400">Failed to load profile. Please try again.</p>
                </div>
            )}
            {!isLoading && !user && (
                <div className="flex flex-col items-center justify-center min-h-96 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-white text-xl mb-2">User not found</p>
                    <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
                </div>
            )}

            {/* MAIN PROFILE SECTION */}
            {user && !isLoading && (
                <div className="flex flex-col">
                    {/* Enhanced Header */}
                    <header className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-gray-700/50 z-10">
                        <div className="flex gap-6 px-6 py-4 items-center">
                            <Link to="/" className="group p-2 rounded-full hover:bg-gray-800/50 transition-colors duration-300">
                                <FaArrowLeft className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" />
                            </Link>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h1 className="font-bold text-xl">{user?.firstname}</h1>
                                    {user?.verified && <BsShieldCheck className="w-5 h-5 text-blue-400" />}
                                </div>
                                <span className="text-sm text-gray-400">{user?.posts?.length || 0} posts</span>
                            </div>
                        </div>
                    </header>

                    {/* Enhanced Cover Image */}
                    <div className="relative">
                        {/* Cover Image Section */}
                        <div className="relative group/cover overflow-hidden h-48">
                            <img
                                src={coverimg || user?.coverimg || "/cover.png"}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
                                alt="Cover image"
                                onError={(e) => {
                                    e.target.src = "/cover.png"
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            
                            {isMyProfile && (
                                <button
                                    className="absolute top-4 right-4 p-3 bg-black/70 backdrop-blur-sm rounded-full text-white opacity-0 group-hover/cover:opacity-100 hover:bg-black/80 transition-all duration-300"
                                    onClick={() => coverImgRef.current.click()}
                                >
                                    <HiCamera className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Profile Image Container */}
                        <div className="relative px-6 pb-4">
                            <div className="flex justify-between items-end">
                                {/* Profile Image */}
                                <div className="relative -mt-16 group/avatar">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-xl">
                                        <img 
                                            src={profileimg || user?.profile || "/avatar-placeholder.png"} 
                                            alt="Profile" 
                                            className="w-full h-full rounded-full object-cover bg-gray-800 border-4 border-black transition-transform duration-300 group-hover/avatar:scale-105"
                                            onError={(e) => {
                                                e.target.src = "/avatar-placeholder.png"
                                            }}
                                        />
                                    </div>
                                    
                                    {isMyProfile && (
                                        <button
                                            className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full text-white opacity-0 group-hover/avatar:opacity-100 hover:bg-blue-600 transition-all duration-300 border-2 border-black shadow-lg"
                                            onClick={() => profileImgRef.current.click()}
                                        >
                                            <HiCamera className="w-4 h-4" />
                                        </button>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 mb-4">
                                    {isMyProfile ? (
                                        <>
                                            <EditProfileModal />
                                            {(coverimg || profileimg) && (
                                                <button
                                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                    onClick={() => updateData({coverimg, profileimg})}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <HiSparkles className="w-4 h-4" />
                                                        <span>Save</span>
                                                    </div>
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button 
                                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                                                me?.following?.includes(user._id)
                                                    ? 'bg-gray-800 border-2 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500'
                                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                                            }`}
                                            onClick={() => toFollow(user._id)}
                                            disabled={isFollowing}
                                        >
                                            {isFollowing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                me?.following?.includes(user._id) ? "Unfollow" : "Follow"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hidden inputs for file uploads */}
                        <input 
                            type="file" 
                            hidden 
                            accept="image/*" 
                            ref={coverImgRef} 
                            onChange={(e) => handleImgChange(e, "coverImg")} 
                        />
                        <input 
                            type="file" 
                            hidden 
                            accept="image/*" 
                            ref={profileImgRef} 
                            onChange={(e) => handleImgChange(e, "profileImg")} 
                        />
                    </div>

                    {/* Enhanced Profile Info */}
                    <div className="px-6 mt-4">
                        <div className="space-y-6">
                            {/* Name and Bio */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-white">{user?.firstname}</h1>
                                    {user?.verified && (
                                        <div className="p-1 bg-blue-500/20 rounded-full">
                                            <BsShieldCheck className="w-5 h-5 text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-400 text-lg">@{user?.username}</p>
                                {user?.bio && (
                                    <p className="text-white text-lg leading-relaxed max-w-2xl">{user?.bio}</p>
                                )}
                            </div>

                            {/* Links and Join Date */}
                            <div className="flex flex-wrap gap-6">
                                {user?.link && (
                                    <a 
                                        href={user.link} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                                    >
                                        <FaLink className="w-4 h-4" />
                                        <span className="hover:underline">{user.link}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-2 text-gray-400">
                                    <IoCalendarOutline className="w-5 h-5" />
                                    <span>Joined {user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'July 2021'}</span>
                                </div>
                            </div>

                            {/* Followers and Following */}
                            <div className="flex gap-8">
                                <div className="group cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-white">{user?.following?.length || 0}</span>
                                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Following</span>
                                    </div>
                                </div>
                                <div className="group cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-white">{user?.followers?.length || 0}</span>
                                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Enhanced Feed Selection - Show for all profiles */}
                    <div className="mt-6 mx-6">
                        <div className="flex bg-gray-800/30 rounded-2xl p-2 border border-gray-700/50">
                            {/* Show posts and likes tabs only for own profile, just posts for others */}
                            {isMyProfile ? (
                                ["posts", "likes"].map((type) => (
                                    <button
                                        key={type}
                                        className={`relative flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                                            feedType === type 
                                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                                                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                                        }`}
                                        onClick={() => setFeedType(type)}
                                    >
                                        <span className="relative z-10">
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </span>
                                        {feedType === type && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur-xl"></div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg text-center">
                                    <span className="relative z-10">Posts</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Posts Component - Show for all profiles */}
                    <div className="mt-4">
                        <Posts feedType={isMyProfile ? feedType : "posts"} user={user?._id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;