import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
 
  const {data:authData}=useQuery({
    queryKey:["authData"],
    queryFn:async()=>{
      try {
        const res = await axios.get(`${baseUrl}/api/auth/me`, {
          headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
          },
          withCredentials:true
        });
        return res.data;
      } catch (error) {
        return null;
      }
    }
  });

  const { mutate: logout, error, isError } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(
          `${baseUrl}/api/auth/logout`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );
        return res.data;
      } catch (err) {
        throw new Error("Logout failed");
      }
    },
    onSuccess: () => {
      toast.success("Logout successfully");
      queryClient.setQueryData(["authData"], null);
      queryClient.invalidateQueries(["authData"]);
      navigate("/");
    },
  });

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const navItems = [
    { path: "/", icon: MdHomeFilled, label: "Home", size: "w-7 h-7" },
    ...(authData ? [
      { path: "/notifications", icon: IoNotifications, label: "Notifications", size: "w-6 h-6" },
      { path: `/profile/${authData?.username}`, icon: FaUser, label: "Profile", size: "w-6 h-6" }
    ] : [])
  ];

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.includes(path.split("/")[1]);
  };

  return (
    <div className="md:flex-[2_2_0] bg-black text-white w-18 max-w-64 h-screen overflow-hidden">
      <div 
        className="h-full flex flex-col border-r border-gray-800/50 w-20 md:w-full backdrop-blur-xl bg-black/95 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="p-4 mb-4">
          <Link to="/" className="flex justify-center md:justify-start group">
            <div className="relative">
              <XSvg className="w-10 h-10 fill-white group-hover:fill-blue-400 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <li key={item.path} className="group">
                  <Link
                    to={item.path}
                    className={`relative flex gap-4 items-center transition-all duration-300 py-3 px-4 rounded-2xl overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30' 
                        : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    {/* Animated background */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform transition-transform duration-300 ${
                      isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'
                    }`}></div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                    )}
                    
                    <Icon className={`${item.size} relative z-10 transition-all duration-300 ${
                      isActive ? 'text-blue-400' : 'group-hover:text-blue-300'
                    }`} />
                    
                    <span className={`text-xl font-medium hidden md:block relative z-10 transition-all duration-300 ${
                      isActive ? 'text-white' : 'group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-blue-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        {authData && (
          <div className="p-4 mt-auto">
            <Link
              to={`/profile/${authData?.username}`}
              className="group flex gap-3 items-center transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 py-3 px-4 rounded-2xl border border-transparent hover:border-gray-700/50"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                  <img 
                    src={authData?.profile || "/avatar-placeholder.png"} 
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover bg-gray-800"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              
              <div className="hidden md:block flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors duration-300">
                  {authData?.firstname}
                </p>
                <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors duration-300">
                  @{authData?.username}
                </p>
              </div>
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 w-full mt-4 py-3 px-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/30"
            >
              <BiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:block font-medium">Logout</span>
            </button>
          </div>
        )}
        
        {/* Guest Login Button */}
        {!authData && (
          <div className="p-4 mt-auto">
            <Link
              to="/login"
              className="group flex items-center justify-center gap-3 w-full py-3 px-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
            >
              <BiLogOut className="w-5 h-5 rotate-180" />
              <span className="hidden md:block">Log in</span>
            </Link>
          </div>
        )}
      </div>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #374151',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
};

export default Sidebar;
