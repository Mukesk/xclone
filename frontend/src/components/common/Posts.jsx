import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import baseUrl from "../../constant/baseUrl";


const Posts = ({ feedType ,user}) => {
  const {data:authData}=useQuery({queryKey:['authUser']})
  const endpointMap = {
    forYou: `${baseUrl}/api/post/foryou`,
    following: `${baseUrl}/api/post/following`,
    likes:`${baseUrl}/api/post/likedpost`,
    posts:`${baseUrl}/api/post/getallPosts`

  };

  const endPoint = endpointMap[feedType];

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["getPosts", endPoint],
    queryFn: async () => {
      const res = await axios.get(endPoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      return res.data;
    },
  });

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {error && (
        <p className="text-center text-red-500">
          Failed to load posts. Please try again.
        </p>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
