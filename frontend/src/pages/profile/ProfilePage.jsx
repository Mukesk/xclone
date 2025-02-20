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
import useFollow from "../../hooks/useFollow";
import toast from "react-hot-toast";


const ProfilePage = () => {
    const [coverimg, setCoverImg] = useState(null);
    const [profile, setProfileImg] = useState(null);
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

    const {mutate:updateData,data:updatedData}=useMutation({mutationFn:async({profile,coverimg})=>{
        const res= await axios.post(`${baseUrl}/api/user/updateProfile`,
            {profile,coverimg
            },{headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        },withCredentials:true})
        return res.data
      
          },onSuccess:()=>{
          toast.success("Updated")
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
    const { data: me } = useQuery({ queryKey: ["authUser"] });
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
        <div className="flex-[4_4_0] text-white border-r border-gray-700 min-h-screen">
            {/* LOADING / ERROR HANDLING */}
            {isLoading && <ProfileHeaderSkeleton />}
            {isError && <p className="text-center text-red-500 mt-4">Failed to load profile</p>}
            {!isLoading && !user && <p className="text-center text-lg mt-4">User not found</p>}

            {/* MAIN PROFILE SECTION */}
            {user && !isLoading && (
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="flex gap-10 px-4 py-2 items-center">
                        <Link to="/">
                            <FaArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex flex-col">
                            <p className="font-bold text-lg">{user?.firstname}</p>
                            <span className="text-sm text-slate-500">{user?.posts?.length || 0} posts</span>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="relative group/cover">
                        <img
                            src={coverimg || user?.coverimg || "/cover.png"}
                            className="h-52 w-full object-cover"
                            alt="cover"
                        />
                        {isMyProfile && (
                            <div
                                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                                onClick={() => coverImgRef.current.click()}
                            >
                                <MdEdit className="w-5 h-5 text-white" />
                            </div>
                        )}

                        <input type="file" hidden accept="image/*" ref={coverImgRef} onChange={(e) => handleImgChange(e, "coverImg")} />
                        <input type="file" hidden accept="image/*" ref={profileImgRef} onChange={(e) => handleImgChange(e, "profileImg")} />

                        {/* Profile Image */}
                        <div className="avatar absolute rounded-full -bottom-16 left-4">
                            <div className="w-20 rounded-md overflow-hidden relative group/avatar">
                                <img src={profile|| user?.profile || "/avatar-placeholder.png"} alt="profile" />
                                {isMyProfile && (
                                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                                        <MdEdit className="w-4 h-4 text-white" onClick={() => profileImgRef.current.click()} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="flex justify-end px-4 mt-5">
                        {isMyProfile ? (
                            <EditProfileModal />
                        ) : (
                            <button className="btn btn-outline rounded-full btn-sm" onClick={()=>{toFollow(user._id)}}>
                               {me?.following?.includes(user._id)?"unfollow":"follow"}
                            </button>
                        )}
                        {(coverimg || profile) && (
                            <button
                                className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                                onClick={() => updateData({coverimg,profile})}
                            >
                                Update
                            </button>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col gap-4 mt-14 px-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg">{user?.firstname}</span>
                            <span className="text-sm text-slate-500">@{user?.username}</span>
                            <span className="text-sm my-1">{user?.bio}</span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {user?.link && (
                                <div className="flex gap-1 items-center">
                                    <FaLink className="w-3 h-3 text-slate-500" />
                                    <a href={user?.link} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                                        {user?.link}
                                    </a>
                                </div>
                            )}
                            <div className="flex gap-2 items-center">
                                <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-500">Joined July 2021</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex gap-1 items-center">
                                <span className="font-bold text-xs">{user?.following?.length || 0}</span>
                                <span className="text-slate-500 text-xs">Following</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="font-bold text-xs">{user?.followers?.length || 0}</span>
                                <span className="text-slate-500 text-xs">Followers</span>
                            </div>
                        </div>
                    </div>
           {isMyProfile && (<>
                    {/* Feed Selection */}
                    <div className="flex w-full border-b border-gray-700 mt-4">
                        {["posts", "likes"].map((type) => (
                            <div
                                key={type}
                                className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${
                                    feedType === type ? "text-white" : "text-slate-500"
                                }`}
                                onClick={() => setFeedType(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                {feedType === type && <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />}
                            </div>
                        ))}
                    </div>

                    {/* Posts Component */}
                    <Posts feedType={feedType} user={user?._id} /></>	)}																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																	
                </div>
            )}
        </div>
    );
};

export default ProfilePage;