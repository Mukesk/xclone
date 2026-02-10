import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="w-full text-white bg-black">
      {/* Enhanced Header */}
      <header className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-gray-700/50 z-10">
        <div className="flex w-full">
          <div
            className={`flex justify-center flex-1 p-4 transition-all duration-300 cursor-pointer relative group ${
              feedType === "forYou" 
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            <span className="font-semibold">For You</span>
            {feedType === "forYou" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            )}
          </div>
          <div
            className={`flex justify-center flex-1 p-4 transition-all duration-300 cursor-pointer relative group ${
              feedType === "following" 
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
            onClick={() => setFeedType("following")}
          >
            <span className="font-semibold">Following</span>
            {feedType === "following" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            )}
          </div>
        </div>
      </header>

      {/* CREATE POST INPUT */}
      <CreatePost />

      {/* POSTS */}
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
