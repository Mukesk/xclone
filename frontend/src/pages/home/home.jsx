import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { data: authData } = useQuery({ queryKey: ["authData"] });
  // Default to 'forYou' as we removed the toggle
  const feedType = "forYou";

  return (
    <div className="w-full text-white bg-black">
      {/* Enhanced Header */}
      {/* Enhanced Header */}
      <header className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-gray-700/50 z-10 p-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Posts
        </h1>
      </header>

      {/* CREATE POST INPUT */}
      {authData && <CreatePost />}

      {/* POSTS */}
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
