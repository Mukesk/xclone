import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import baseUrl from "../../../constant/baseUrl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // For navigation after successful signup

const Signup = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate(); // To redirect user after successful signup

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async ({ firstname, email, username, password }) => {
      const res = await axios.post(
        `${baseUrl}/api/auth/signup`,
        { firstname, username, password, email },
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
      toast.success("User created successfully");
      navigate("/login"); // Redirect to the login page after signup
    },
    onError: (error) => {
      toast.error("Signup failed: " + (error.response?.data?.message || "Unknown error"));
    },
  });

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(userData); // Call the mutation function
  };

  return (
    <>
      <div className="bg-black flex flex-col justify-center items-center text-gray-50 h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-1/2">
          <h1 className="text-5xl">Signup</h1>

          <div className="text-2xl">Name</div>
          <input
            className="border-gray-500n text-black h-12 border rounded"
            value={userData.firstname}
            placeholder="Fullname"
            name="firstname"
            type="text"
            onChange={handleData}
            required
          />

          <div className="text-2xl">Username</div>
          <input
            className="border-gray-500 h-12 text-black border rounded"
            value={userData.username}
            placeholder="Username"
            name="username"
            type="text"
            onChange={handleData}
            required
          />

          <div className="text-2xl">Password</div>
          <input
            className="border-gray-500 h-12 text-black border rounded"
            value={userData.password}
            placeholder="Password"
            name="password"
            type="password"
            onChange={handleData}
            required
          />

          <div className="text-2xl">E-Mail</div>
          <input
            className="border-gray-500 text-black h-12 border rounded"
            value={userData.email}
            placeholder="E-Mail Address"
            name="email"
            type="email"
            onChange={handleData}
            required
          />
          <br />
          <button
            type="submit"
            className="p-1 rounded border border-slate-500"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? "Signing up..." : "Signup"} {/* Show loading text */}
          </button>

          {isError && (
            <p className="text-red-500">
              Error: {error?.response?.data?.message || "Signup failed"}
            </p>
          )}

          {/* Add the "Already have an account?" text and the Login button */}
          <div className="flex justify-center items-center mt-4">
            <p className="text-white mr-2">Already have an account?</p>
            <button
              type="button"
              onClick={() => navigate("/login")} // Redirect to login page
              className="text-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  );
};

export default Signup;
