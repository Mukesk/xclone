import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";
import toast, { Toaster } from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
 
  const {data:authData}=useQuery({
    queryKey:["authUser"],queryFn:async()=>{
      const res = axios.get(`${baseUrl}/api/auth/me` ,{headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
      },
      withCredentials:true
    }

  )
   return (await res).data
}

  }
  )

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
      queryClient.invalidateQueries(["logout"]);
    },
  });

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="md:flex-[2_2_0] bg-black text-white w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authData?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authData && (
          <Link
            to={`/profile/${authData?.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authData?.profile || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authData?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authData?.username}</p>
              </div>
            </div>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-4 ml-4 text-red-500 hover:text-red-400"
        >
          <BiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default Sidebar;
