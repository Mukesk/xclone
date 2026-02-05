import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import baseUrl from "../../constant/baseUrl";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const Posts = ({ feedType, user }) => {
  // Determine the correct endpoint based on feedType and user context
  const getEndpoint = () => {
    const endpointMap = {
      forYou: `${baseUrl}/api/post/foryou`,
      following: `${baseUrl}/api/post/following`,
      likes: `${baseUrl}/api/post/likedpost`, 
      posts: `${baseUrl}/api/post/getallPosts`
    };
    return endpointMap[feedType] || `${baseUrl}/api/post/getallPosts`;
  };

  const endPoint = getEndpoint();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["getPosts", feedType, user || "all"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await axios.get(endPoint, {
          // Pass `userId` param only if we have a user prop (profile page)
          params: { 
             page: pageParam, 
             limit: 10,
             ...(user && { userId: user }) 
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        const posts = res.data || [];
        
        // Client-side filtering if necessary (mostly back compat)
        if (user && posts.length > 0) {
           // Note: Backend might return "my" posts for `getallPosts`, 
           // filtering for `user` (profile owner) might result in empty.
           // Leaving this as-is for now to match original logic, 
           // though backend pagination makes this inefficient.
           return posts.filter(post => post.user._id === user);
        }
        return posts;
      } catch (err) {
        console.error('Error fetching posts:', err);
        throw err;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const loadMoreRef = useIntersectionObserver(fetchNextPage, hasNextPage);

  const posts = data?.pages.flat() || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Loading State or Posts */}
      {isLoading && (
        <div className="flex flex-col justify-center space-y-6 animate-fade-in">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
              <PostSkeleton />
            </div>
          ))}
        </div>
      )}
      
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">😓</div>
          <p className="text-red-400 text-xl mb-2">Oops! Something went wrong</p>
          <p className="text-gray-400">Failed to load posts.</p>
        </div>
      )}
      
      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No posts yet
          </h3>
          <p className="text-gray-400 max-w-md">
             Be the first to share something!
          </p>
        </div>
      )}
      
      {!isLoading && !isError && posts.length > 0 && (
        <div className="space-y-1 animate-fade-in stagger-animation">
          {posts.map((post, index) => (
            <div 
              key={post._id + '-' + index} 
              className="animate-fade-in-up" 
            >
              <Post post={post} />
            </div>
          ))}
          
          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
             {isFetchingNextPage && <div className="loading loading-spinner text-primary"></div>}
             {!hasNextPage && posts.length > 10 && (
                 <p className="text-gray-600 text-sm">No more posts</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
