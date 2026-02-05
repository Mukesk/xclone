import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import baseUrl from "../../../constant/baseUrl";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async ({ email, username, firstname, password }) => {
      const res = await axios.post(
        `${baseUrl}/api/auth/signup`,
        { email, username, firstname, password },
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
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10 bg-black">
      {/* Left Side */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      
      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white mb-4">Join today.</h1>
          
          <label className="input input-bordered rounded-full flex items-center gap-2 bg-black border-gray-700 focus-within:border-blue-500 text-white h-12 px-4">
            <MdOutlineMail className="text-gray-500" />
            <input
              type="email"
              className="grow bg-transparent border-none outline-none placeholder-gray-500"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
            />
          </label>
          
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded-full flex items-center gap-2 flex-1 bg-black border-gray-700 focus-within:border-blue-500 text-white h-12 px-4">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                className="grow bg-transparent border-none outline-none placeholder-gray-500"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className="input input-bordered rounded-full flex items-center gap-2 flex-1 bg-black border-gray-700 focus-within:border-blue-500 text-white h-12 px-4">
              <MdDriveFileRenameOutline className="text-gray-500" />
              <input
                type="text"
                className="grow bg-transparent border-none outline-none placeholder-gray-500"
                placeholder="Full Name"
                name="firstname"
                onChange={handleInputChange}
                value={formData.firstname}
                required
              />
            </label>
          </div>
          
          <label className="input input-bordered rounded-full flex items-center gap-2 bg-black border-gray-700 focus-within:border-blue-500 text-white h-12 px-4">
            <MdPassword className="text-gray-500" />
            <input
              type="password"
              className="grow bg-transparent border-none outline-none placeholder-gray-500"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>
          
          <button 
            className="btn rounded-full btn-primary bg-white text-black hover:bg-gray-200 border-none w-full h-12 font-bold mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign up"}
          </button>
          
          {isError && <p className="text-red-500 text-center">{error.response?.data?.message || "Something went wrong"}</p>}
        </form>
        
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4 mx-auto md:mx-20">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login" className="w-full">
            <button className="btn rounded-full btn-outline border-gray-600 text-blue-500 hover:bg-blue-500/10 hover:border-blue-500 w-full h-12 font-bold">Sign in</button>
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
export default SignUp;
