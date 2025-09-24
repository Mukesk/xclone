import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import baseUrl from "../../constant/baseUrl";


const Posts = ({ feedType, user }) => {
  const {data: authData} = useQuery({queryKey: ['authData']});
  
  // Determine the correct endpoint based on feedType and user context
  const getEndpoint = () => {
    const endpointMap = {
      forYou: `${baseUrl}/api/post/foryou`,
      following: `${baseUrl}/api/post/following`,
      likes: user ? `${baseUrl}/api/post/likedpost` : `${baseUrl}/api/post/likedpost`,
      posts: user ? `${baseUrl}/api/post/getallPosts` : `${baseUrl}/api/post/getallPosts`
    };
    return endpointMap[feedType] || `${baseUrl}/api/post/getallPosts`;
  };

  const endPoint = getEndpoint();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["getPosts", feedType, user || "all"],
    queryFn: async () => {
      try {
        const res = await axios.get(endPoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });
        
        // Filter posts by user if we're on a profile page
        if (user && res.data) {
          return res.data.filter(post => post.user._id === user);
        }
        
        return res.data || [];
      } catch (err) {
        console.error('Error fetching posts:', err);
        throw err;
      }
    },
  });

  return (
    <div className="min-h-screen">
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center space-y-6 animate-fade-in">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
              <PostSkeleton />
            </div>
          ))}
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">😓</div>
          <p className="text-red-400 text-xl mb-2">Oops! Something went wrong</p>
          <p className="text-gray-400">Failed to load posts. Please try refreshing the page.</p>
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && !error && posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {feedType === 'likes' ? 'No liked posts yet' : 'No posts yet'}
          </h3>
          <p className="text-gray-400 max-w-md">
            {user 
              ? (feedType === 'likes' 
                  ? "Posts that this user likes will appear here." 
                  : "This user hasn't posted anything yet."
                )
              : "Be the first to share something with the community!"
            }
          </p>
        </div>
      )}
      
      {/* Posts List */}
      {!isLoading && !error && posts && posts.length > 0 && (
        <div className="space-y-1 animate-fade-in stagger-animation">
          {posts.map((post, index) => (
            <div 
              key={post._id} 
              className="animate-fade-in-up" 
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
