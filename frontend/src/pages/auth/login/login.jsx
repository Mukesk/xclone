import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import baseUrl from "../../../constant/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

const Login = () => {
  const [userData, setUserdata] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleData = (e) => {
    setUserdata({ ...userData, [e.target.name]: e.target.value });
  };

  const { mutate: login, isLoading, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await axios.post(
        `${baseUrl}/api/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      queryClient.invalidateQueries(["authData"]);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(userData);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen bg-black">
      {/* Left Side - Big Logo (Desktop) */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8">
            <XSvg className="w-12 fill-white" />
          </div>

          <h1 className="text-4xl lg:text-7xl font-extrabold text-white mb-8 mb-12 tracking-tight">
            Happening now
          </h1>

          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
            Join today.
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Username Input */}
            <label className="input input-bordered rounded-full flex items-center gap-2 border-gray-700 bg-black text-white focus-within:border-blue-500 transition-colors h-14 px-6">
              <FaUser className="text-gray-500 w-4 h-4" />
              <input
                type="text"
                className="grow bg-transparent border-none outline-none text-white placeholder-gray-500"
                placeholder="Username"
                name="username"
                onChange={handleData}
                value={userData.username}
                required
              />
            </label>

            {/* Password Input */}
            <label className="input input-bordered rounded-full flex items-center gap-2 border-gray-700 bg-black text-white focus-within:border-blue-500 transition-colors h-14 px-6">
              <MdPassword className="text-gray-500 w-5 h-5" />
              <input
                type="password"
                className="grow bg-transparent border-none outline-none text-white placeholder-gray-500"
                placeholder="Password"
                name="password"
                onChange={handleData}
                value={userData.password}
                required
              />
            </label>

            <button
              className="btn rounded-full btn-primary bg-white text-black hover:bg-gray-200 border-none h-12 text-lg font-bold mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            {isError && (
              <p className="text-red-500 text-sm text-center">
                {error?.response?.data?.message || "Something went wrong"}
              </p>
            )}
          </form>

          <div className="flex flex-col gap-2 mt-10">
            <p className="text-white text-lg font-bold">
              Don't have an account?
            </p>
            <Link to="/signup">
              <button className="btn rounded-full btn-outline border-gray-600 text-blue-500 hover:bg-blue-500/10 hover:border-blue-500 w-full h-12 font-bold transition-all">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
export default Login;
