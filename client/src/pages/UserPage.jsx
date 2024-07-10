import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom'
import { Flex, Spinner, useToast } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
const UserPage = () => {
  const {user, loading} = useGetUserProfile()
  const { username } = useParams()
  const [posts,setPosts]= useRecoilState(postsAtom)
  const [fetchingPosts,setFetchingPosts] =useState(true)
  const toast = useToast()
  useEffect(()=>{
     
     const getPosts =async()=>{
      setFetchingPosts(true)
       try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json()
        if(res.ok){
          setPosts(data)
        }else{
          toast({
            title: "Error",
            description:data.message,
            status: "error",
            duration: 3000,
          });
        }
       } catch (error) {
        setPosts([])
        toast({
          title: "Error",
          description:error,
          status: "error",
          duration: 3000,
        });
       }finally{
        setFetchingPosts(false)
       }
     }
     getPosts() 
   
  },[username,toast,setPosts])
  // console.log("recoil post",posts)
  if(!user && loading ){
    return(
      <Flex justifyContent={"center"} alignItems={"center"}  >
        <Spinner size={"xl"} />
      </Flex>
    )
  }
  if(!user && !loading ) return <h1>User Not found</h1>

  return (
    <>
    <UserHeader user={user} />
     {!fetchingPosts && posts.length === 0 && <h1>User has not posts</h1> }
     {fetchingPosts &&(
      <Flex justifyContent={"center"} my={12} >
        <Spinner size={"xl"} />
      </Flex>
     )}
     {
     posts.map((post)=>(
      <Post key={post._id} post={post} postedBy={post.postedBy} />
     ))
     }
    </>
  )
}

export default UserPage


