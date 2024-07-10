import { Avatar, Flex, useColorModeValue,Image, Divider,Text, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useEffect, useRef, useState } from 'react'
import conversationAtom, { selectedConversationAtom } from '../atoms/messageAtom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useToast } from '@chakra-ui/react'
import { useSocket } from './SocketContext'

const MessageContainer = () => {
  const toast = useToast()
  const [selectedConversation,setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const [ loadingMessages, setLoadingMessages ] = useState(true)
  const [ messages, setMessages ] = useState([])
  const currentUser = useRecoilValue(userAtom)
  const {socket} = useSocket()
  const setConversations = useSetRecoilState(conversationAtom)
  const messageEndref = useRef(null) 
  useEffect(()=>{
   socket.on('newMessage',(message)=>{
     if(selectedConversation._id === message.conversationId){
      setMessages((prevMessages)=>[...prevMessages,message])
     }
     setConversations((prev)=>{
       const updatedConversations = prev.map((conversation)=>{
        if(conversation._id === message.conversationId){
          return{
            ...conversation,
            lastMessage:{
              text:message.text,
              sender:message.sender, 
            }
          }
        }
        return conversation
       })
       return updatedConversations
     })
   })
   return ()=> socket.off('new Message')
  },[socket])
  useEffect(()=>{
   messageEndref.current?.scrollIntoView({behavior:"smooth"})
  },[messages])
  useEffect(()=>{
    const getMessages =async()=>{
      setLoadingMessages(true)
      setMessages([])
      try {
        if(selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`)
        const data = await res.json()
        if(data.error){
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 3000
          });
          return
        }
       setMessages(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000
        });
      }finally{
        setLoadingMessages(false)
      }
    }
    getMessages()
  },[selectedConversation.userId, selectedConversation.mock])
  return (
    <Flex 
    flex={'70'} 
    bg={useColorModeValue('gray.100','gray.dark')}
    borderRadius={'md'}
    p={2}
    flexDirection={'column'}
    >
     <Flex w={'full'} h={12} alignItems={'center'} gap={2} >
        <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
        <Text display={'flex'} alignItems={'center'} >
            {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
     </Flex>
     <Divider/>
     <Flex flexDir={'column'} gap={4} my={4} height={'400px'} overflowY={'scroll'} >
     {false &&
					[...Array(5)].map((_,i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}
          {
            !loadingMessages && (
              messages.map((message)=>(
                <Flex key={message._id}
                direction={'column'}
                ref={messages.length -1 === messages.indexOf(message) ? messageEndref : null}
                >
                <Message message={message} ownMessage={currentUser._id === message.sender } />
                </Flex>
              ))
            )
          }
     </Flex>
     <MessageInput setMessages={setMessages}/>
    </Flex>
  )
}

export default MessageContainer


