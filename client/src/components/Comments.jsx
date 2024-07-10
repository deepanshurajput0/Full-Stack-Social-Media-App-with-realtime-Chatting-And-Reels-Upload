import { Avatar, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "./Actions"

const Comments = ({reply}) => {
    const [liked,setLiked] = useState(false)
  return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"} >
      <Avatar src={reply.userProfilePic} size={"sm"} />
      <Flex gap={1} w={"full "} flexDirection={"column"} >
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}  >
        <Text  fontSize={"sm"} fontWeight={"bold"}>{reply.username}</Text>
        <Flex alignItems={"center"} >
            <Text mr={5} fontSize={"sm"} color={"gray.light"} >1d</Text>
        </Flex>
        </Flex>
        <Text>{reply.text}</Text>
      </Flex>
    </Flex>
    </>
  )
}

export default Comments