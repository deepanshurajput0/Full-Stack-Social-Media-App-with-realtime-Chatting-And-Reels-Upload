import { Avatar, Box, Flex, VStack, Text, Menu, MenuButton, Portal, MenuItem, MenuList, useToast, Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { useState } from "react"
const UserHeader = ({user}) => {
  const currentUser = useRecoilValue(userAtom)
  const [following,setFollowing] =useState(user.followers.includes(currentUser?._id))
  const [updating,setUpdating] = useState(false)
    const toast = useToast()
    const copyUrl=()=>{
        const currenturl = window.location.href
        navigator.clipboard.writeText(currenturl)
        toast({
            title: `${`Profile Link Copied`}`,
            status: "success",
            isClosable: true,
          })
    }
    const handleFollow=async()=>{
      if(!currentUser){
         toast({
          title:"error",
          description:"Please login to follow",
          status:"error"
         })
         return;
      }
      setUpdating(true)
       try {
        const res = await fetch(`/api/users/follow/${user._id}`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          }
        })
        const data = await res.json()
        if(res.ok){
          if(following){
            user.followers.pop()
          }else{
            user.followers.push(currentUser?._id)
          }
          setFollowing(!following)
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
        setUpdating(false)
       }
    }
  return (
    <VStack gap={"4"} alignItems={"start"}  >
      <Flex  justifyContent={"space-between"} w={"full"}  >
        <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"} >
                {user.name}
            </Text>
            <Flex gap={"2"} alignItems={"center"} >
              <Text fontSize={"sm"} >{user.username}</Text>
              <Text fontSize={"xs"} color={"gray.light"} bg={"gray.dark"} p={"1"} borderRadius={"full"} > threads.next</Text>
            </Flex>
        </Box>
        <Box>
             {
              user.profilePic && (
                <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base:"md",
              md:"xl"
            }}
            />
              )
             }
             {
              !user.profilePic && (
                <Avatar
            name={user.name}
            src='https://bit.ly/broken-link'
            size={{
              base:"md",
              md:"xl"
            }}
            />
              )
             }
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {
        currentUser?._id === user._id && (
          <Link to={'/update'} >
          <Button  size={"sm"} >Update Profile</Button>
          </Link>
        )
      }
      {
        currentUser?._id !== user._id && (
          <Button isLoading={updating} onClick={handleFollow}  size={"sm"} >{following ? 'Unfollow':"Follow" }</Button>
        )
      }
      <Flex w={"full"} justifyContent={"space-between"} >
      <Flex gap={"2"} alignItems={"center"} >
        <Text color={"gray.light"} >{user.followers.length} followers</Text>
        <Box w={"1"} h={"1"} bg={"gray.light"} borderRadius={"full"}  ></Box>
        <Link color={"gray.light"} >instagram.com</Link>
      </Flex>
      <Flex>
        <Box className="icon-container" >
            <BsInstagram size={24} cursor={"pointer"} />
        </Box>
        <Box className="icon-container" >
           <Menu>
            <MenuButton>
            <CgMoreO size={24} cursor={"pointer"} />
            </MenuButton>
            <Portal>
                <MenuList bg={"gray.dark"} >
                    <MenuItem bg={"gray.dark"} onClick={copyUrl} >Copy Link</MenuItem>
                </MenuList>
            </Portal>
           </Menu>
        </Box>
      </Flex>
      </Flex>
      <Flex w={"full"} >
         <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={"3"} cursor={"pointer"}  >
          <Text fontWeight={"bold"} > Threads </Text>    
        </Flex>     
         <Flex color={"gray.light"} flex={1} borderBottom={"1px solid white"} justifyContent={"center"} pb={"3"} cursor={"pointer"}  >
          <Text fontWeight={"bold"} > Replies </Text>    
        </Flex>     
      </Flex>
    </VStack>
  )
}

export default UserHeader


