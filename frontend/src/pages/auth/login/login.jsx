import { Query, QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import baseUrl from '../../../constant/baseUrl';
import toast, { Toaster } from 'react-hot-toast';
import {Navigate} from 'react-router-dom'

const Login = () => {
  const [userData, setUserdata] = useState({
    username: '',
    password: '',
  });
  const queryClient= useQueryClient();
 

  
  

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
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            withCredentials: true,
          }
        );
        return res.data;
     
    },
    onSuccess: () => {
      console.log('Login successful');
      toast.success('Login successful')

        queryClient.invalidateQueries(['logout'])
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(userData);
  };

  return (
    <>
      <div className="bg-black flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col gap-3 w-1/2">
          <h1 className="text-5xl text-gray-50">Login</h1>

          <div className="text-2xl text-gray-50">Username</div>
          <input
            className="border-gray-500 h-12 text-black border rounded"
            placeholder="Username"
            name="username"
            type="text"
            value={userData.username}
            onChange={handleData}
            required
          />
          <div className="text-2xl text-gray-50">Password</div>
          <input
            className="border-gray-500 h-12 text-black border rounded"
            placeholder="Password"
            name="password"
            type="password" 
            value={userData.password}
            onChange={handleData}
            required
          />
          <br />
          <button
            type="submit"
            onClick={handleSubmit}
            className="p-1 rounded border text-gray-50 border-slate-500"
          > 
            Login
          </button>
         <p className="text-white"> Don't have an account ?  </p>
        <button className='text-white border-solid border-white ' onClick={()=>{<Navigate to="/signup"/>}}>signup</button>
          </div>
        </div>
        <div>
          
      </div>
      <Toaster/>
    </>
  );
};

export default Login;
