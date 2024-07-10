import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid to generate unique ids
import Conversation from '../components/Conversation';
import { GiConversation } from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast';
import { useToast } from '@chakra-ui/react';
import conversationAtom,{ selectedConversationAtom } from '../atoms/messageAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../components/SocketContext';

const ChatPage = () => {
  const showToast = useShowToast();
  const toast = useToast();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchText, setSearchText] = useState('');
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const getConversations = async () => {
      setLoadingConversations(true);
      try {
        const res = await fetch('/api/messages/conversations');
        const data = await res.json();
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error"
          });
          return;
        }
        setConversations(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error"
        });
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [setConversations, toast]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchUser = await res.json();
      if (searchUser.error) {
        showToast('Error', searchUser.error, 'error');
        return;
      }
      const messagingYourself = searchUser._id === currentUser._id;
      if (messagingYourself) {
        toast({
          title: "Error",
          description: "You cannot message yourself",
          status: "error",
          duration: 3000
        });
        return;
      }
      const conversationAlreadyExists = conversations.find((conversation) => conversation.participants[0]._id === searchUser._id);
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchUser._id,
          username: searchUser.username,
          userProfilePic: searchUser.profilePic
        });
        return;
      }
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: uuidv4(), // Use uuidv4 to generate a unique id
        participants: [
          {
            _id: searchUser._id,
            username: searchUser.username,
            profilePic: searchUser.profilePic,
          }
        ]
      };
      setConversations((prevConv) => [...prevConv, mockConversation]);
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box position={'absolute'} left={'50%'} w={{
      base: '100%',
      md: '80%',
      lg: '750px'
    }}
      p={4}
      transform={'translateX(-50%)'}
    >
      <Flex gap={'4'} flexDirection={{
        base: 'column',
        md: 'row'
      }}
        maxW={{
          sm: '400px',
          md: 'full'
        }}
        mx={'auto'}
      >
        <Flex flex={40} gap={2} flexDirection={'column'} maxW={{
          sm: '250px',
          md: 'full'
        }} >
          <Text>Your Conversations</Text>
          <form onSubmit={handleConversationSearch} >
            <Flex>
              <Input w={'10rem'} placeholder='Search for user ' onChange={(e) => setSearchText(e.target.value)} />
              <Button size={'sm'} ml={'10px'} onClick={handleConversationSearch} isLoading={searchingUser} >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {
            loadingConversations && (
              [0, 1, 2, 3, 4].map((_, index) => (
                <Flex key={`skeleton-${index}`} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}  >
                  <Box>
                    <SkeletonCircle size={'10'} />
                  </Box>
                  <Flex w={'full'} flexDirection={'column'} gap={3} >
                    <Skeleton h={'10px'} w={'80px'} />
                    <Skeleton h={'8px'} w={'90%'} />
                  </Flex>
                </Flex>
              ))
            )
          }
          <>
            {!loadingConversations && conversations.length > 0
              && 
              <> 
              
                      { console.log("Conversation IDs:", conversations.map(convo => convo._id))  }
                       {
                       conversations.map((conversation,index) => (
                         <Conversation
                         key={`${conversation._id}-${index}`}
                           isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                           conversation={conversation} />
                       ))
              }
              </>
            }
          </>
        </Flex>
        {
          !selectedConversation._id ? (
            <Flex flex={70} borderRadius={'md'} p={'2'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} height={'400px'} >
              <GiConversation size={100} />
              <Text fontSize={20} >Select a conversation to start messaging </Text>
            </Flex>
          ) : <MessageContainer />
        }
      </Flex>
    </Box>
  );
}

export default ChatPage;
