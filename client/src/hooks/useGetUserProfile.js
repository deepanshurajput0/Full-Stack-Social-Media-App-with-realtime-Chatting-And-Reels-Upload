import { useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const useGetUserProfile = () => {
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)
  const {username} = useParams()
  const toast = useToast()
  useEffect(()=>{
    const getUser = async()=>{
        try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json()
        // console.log(data)
        if(res.ok){
          setUser(data)
        }else{
          toast({
            title: "Error",
            description:data.message,
            status: "error",
            duration: 3000,
          });
        }
  
        } catch (error) {
           console.log(error)
           toast({
            title:"error",
            description:error,
            status:"error"
           })
        }finally{
          setLoading(false)
        }
       }
       getUser()
  },[username])
  return {loading,user}
}

export default useGetUserProfile


