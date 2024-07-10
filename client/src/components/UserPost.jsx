import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Box, Flex, Text, Image } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from './Actions'
const UserPost = () => {
  const [liked,setLiked] =useState(false)
  return (
    <Link to={'/markzuckerberg/posts/1'}>
         <Flex mt={"80px"} >
          <Flex flexDirection={"column"} alignItems={"center"} >
            <Avatar size={"md"} name="mark" src='/zuck-avatar.png' />
            <Box bg={"gray.light"} w={'1px'} mt={"5"}  h={"full"} ></Box>
            <Box position={"relative"} width={"full"} >
            <Avatar
            size={"xs"}
            name='John doe'
            src='https://bit.ly/dan-abramov'
            position={"absolute"}
            top={"3px"}
            // left={"10px"}
            padding={"2px"}
            />
      
            <Avatar
            size={"xs"}
            name='John doe'
            src='https://bit.ly/sage-adebayo'
            position={"absolute"}
            top={"3px"}
            left={"30px"}
            padding={"2px"}
            />
            <Avatar
            size={"xs"}
            name='John doe'
            src='https://bit.ly/prosper-baba'
            position={"absolute"}
            top={"25px"}
            left={"15px"}
            padding={"2px"}
            />
      
          </Box>
          </Flex>
         <Flex flex={1} flexDirection={"column"} gap={2} >
           <Flex justifyContent={"space-between"} w={"full"}   >
             <Flex w={"full"} mt={"2"} alignItems={"center"} >
                <Text ml={"3"} fontSize={"sm"} fontWeight={"bold"} >markzuckerberg</Text>
                <Image src='/verified.png' w={"4"} h={"4"} ml={"1"} />
             </Flex>
             <Flex gap={"4"} alignItems={"center"}  >
              <Text fontSize={"sm"} color={'gray.light'}>1d</Text>
              <BsThreeDots/>
             </Flex>
           </Flex>
           <Text fontSize={"sm"} ml={"10px"} >This is my first Post</Text>
           <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} >
            <Image src='/post1.png' w={"full"} />
           </Box>
           <Flex gap={3} >
             <Actions liked={liked} setLiked={setLiked} />
           </Flex>
         </Flex >
         </Flex>
    </Link>
  )
}

export default UserPost


