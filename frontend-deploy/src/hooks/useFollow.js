import React from 'react'
import baseUrl from "../constant/baseUrl.js"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios"
import toast from 'react-hot-toast';

const useFollow = () => {
 
  const queryClient = useQueryClient()
 
    
    const{mutate:follow,isPending}= useMutation({
    mutationFn:async(id)=>{
         const res = await axios.post(`${baseUrl}/api/user/follow/${id}`,{},{headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
         },withCredentials:true

         })
         return res.data
         
        },
      onSuccess:()=>{
        toast.success("followed")
        Promise.all([
          queryClient.invalidateQueries(['posts']),
          queryClient.invalidateQueries(['suggestions'])

        ])

      }
      }
      
       
   
  )
  return  {follow,isPending}


}
export default useFollow
