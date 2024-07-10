import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Box, Flex, Text, Image } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from "date-fns"
import Actions from './Actions'
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
const Post = ({post,postedBy}) => {
  const [user,setUser] = useState(null)
  const [posts,setPosts] = useRecoilState(postsAtom)
  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const toast = useToast()
  useEffect(()=>{
 const getUser = async()=>{
    try {
        const res = await fetch(`/api/users/profile/${postedBy}`)
        const data = await res.json()
        setUser(data)
    } catch (error) {
        toast({
          title:"error",
          description:error,
          status:"error"
        })
        setUser(null)
    }
 }
 getUser() 
  },[postedBy])
  if(!user) return null

  const handleDeletePost=async(e)=>{
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure want to sure to delete this post")) return;
      const res = await fetch(`/api/posts/${post._id}`,{
        method: "DELETE",
      })
      const data = res.json()
      if(res.ok){
        toast({
          title:"success",
          description:'Post deleted successfully',
          status:"success"
        })
        setPosts(posts.filter((p)=>p._id !== post._id))
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
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
         <Flex mt={"80px"} >
          <Flex flexDirection={"column"} alignItems={"center"} >
            <Avatar onClick={(e)=>{e.preventDefault(); navigate(`/${user.username}`)}} size={"md"} name={user?.name} src={user?.profilePic} />
            <Box bg={"gray.light"} w={'1px'} mt={"5"}  h={"full"} ></Box>
            <Box position={"relative"} width={"full"} >
              {
                post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>
              }
              {
                post.replies[0] && (
                  <Avatar
                  size={"xs"}
                  name='John doe'
                  src={post.replies[0].userProfilePic}
                  position={"absolute"}
                  top={"3px"}
                  // left={"10px"}
                  padding={"2px"}
                  />
                )
              }
          
      
           {
            post.replies[1] &&(
              <Avatar
              size={"xs"}
              name='John doe'
              src={post.replies[1].userProfilePic}
              position={"absolute"}
              top={"3px"}
              left={"30px"}
              padding={"2px"}
              />
            )
           }
           {
            post.replies[2] &&(
              <Avatar
              size={"xs"}
              name='John doe'
              src={post.replies[2].userProfilePic}
              position={"absolute"}
              top={"25px"}
              left={"15px"}
              padding={"2px"}
              />
            )
           }
      
          </Box>
          </Flex>
         <Flex flex={1} flexDirection={"column"} gap={2} >
           <Flex justifyContent={"space-between"} w={"full"}   >
             <Flex w={"full"} mt={"2"} alignItems={"center"} >
                <Text onClick={(e)=>{e.preventDefault(); navigate(`/${user.username}`)}}   ml={"3"} fontSize={"sm"} fontWeight={"bold"} >{user?.username}</Text>
                <Image src='/verified.png' w={"4"} h={"4"} ml={"1"} />
             </Flex>
             <Flex gap={"4"} alignItems={"center"}  >
              <Text fontSize={"sm"} width={36} textAlign={"right"} color={'gray.light'}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {
               currentUser?._id === user._id &&  <DeleteIcon size={20} onClick={handleDeletePost} />
              }
             </Flex>
           </Flex>
           <Text fontSize={"sm"} ml={"10px"} >{post?.text}</Text>
            {
              post?.img && (
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} >
            <Image src={post?.img} w={"full"} />
           </Box>
              )
            }
           <Flex gap={3} >
             <Actions post={post} />
           </Flex>
       
         </Flex >
         </Flex>
    </Link>
  )
}

export default Post


