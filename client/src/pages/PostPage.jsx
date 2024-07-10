import { Avatar, Flex, Text,Box, Image, Divider, Button, Spinner} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comments from '../components/Comments'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import postsAtom from '../atoms/postsAtom'
const PostPage = () => {
  const { pid } = useParams()
  const {user,loading} = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const currentUser = useRecoilValue(userAtom)
  const toast = useToast()
  const navigate = useNavigate() 
  const currentPost = posts[0];
  const handleDeletePost=async(e)=>{
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure want to sure to delete this post")) return;
      const res = await fetch(`/api/posts/${currentPost._id}`,{
        method: "DELETE",
      })
      const data = res.json()
      if(res.ok){
        toast({
          title:"success",
          description:'Post deleted successfully',
          status:"success"
        })
        navigate(`/${user.username}`)
      }else{
        toast({
          title:"error",
          description:data.message,
          status:"error"
        })
      }
    } catch (error) {
      toast({
        title:"error",
        description:error,
        status:"error"
      })
    }
  }
  useEffect(()=>{
    const getPost =async()=>{
      setPosts([])
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json()
        // console.log(data)
        if(res.ok){
          setPosts([data])
        }else{
          toast({
            title: "Error",
            description:data.message,
            status: "error",
            duration: 3000,
          });
        }
  
      } catch (error) {
        toast({
          title: "Error",
          description:error,
          status: "error",
          duration: 3000,
        });
      }
    }
    getPost()
  },[])
  if(!user && loading){
    return(
      <Flex justifyContent={"center"} >
        <Spinner size={"xl"} />
      </Flex>
    )
  }
  if(!currentPost) return null
  return (
    <div>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src='/verified.png' w={"4"} h={"4"} ml={"4"} />
          </Flex>
        </Flex>
        <Flex gap={"4"} alignItems={"center"}  >
              <Text fontSize={"sm"} width={36} textAlign={"right"} color={'gray.light'}>
                {formatDistanceToNow(new Date(currentPost.createdAt))} ago
              </Text>
              {
               currentUser?._id === user._id &&  <DeleteIcon size={20} onClick={handleDeletePost} />
              }
             </Flex>
      </Flex>
      <Text mt={"5"} >{currentPost.text}</Text>
       {
        currentPost.img && (
          <Box mt={"5"} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} >
            <Image src={currentPost.img} w={"full"} />
           </Box>
        )
       }
          <Flex gap={3} my={"3"}>
          <Actions post={currentPost} />
          </Flex>
          <Divider my={"4"} />
          <Flex justifyContent={"space-between"} >
            <Flex gap={"2"} alignItems={"center"} >
              <Text fontSize={"2xl"} >👋</Text>
              <Text color={"gray.light"}>Get this app to like, reply and post</Text>
            </Flex>
            <Button> Get </Button>
          </Flex>
          <Divider my={4} />
          {
            currentPost.replies.map(reply=>(
              <Comments 
              key={reply._id}
              reply={reply}
              />
            ))
          }
    </div>
  )
}

export default PostPage


