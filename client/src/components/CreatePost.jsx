import React, { useRef, useState } from 'react';
import { Button, useColorModeValue, useDisclosure, Text,FormControl, Textarea, Input, Flex, Image, CloseButton } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { BsFillImageFill } from "react-icons/bs"
import usePreviewImg from '../hooks/usePreviewImg';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom'
const CreatePost = () => {
    const toast = useToast()
    const maxLength = 500
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {handleImageChange, imgUrl, setImgUrl}  = usePreviewImg()
    const [postText,setPostText] = useState('')
    const imageRef = useRef(null)
    const user = useRecoilValue(userAtom)
    const [remainingChar,setRemainingChar] = useState(maxLength)
    const [loading,setLoading] = useState(false)
    const [posts, setPosts] = useRecoilState(postsAtom)
    const handleTextChange=(e)=>{
      const inputText = e.target.value
      if(inputText.length>maxLength){
        const truncatedText = inputText.slice(0,maxLength)
        setPostText(truncatedText)
        setRemainingChar(0)
      }else{
        setPostText(inputText)
        setRemainingChar(maxLength - inputText.length)
      }
    }
    const handleCreatePost =async(e)=>{
      e.preventDefault()
      setLoading(true)
      try {
        const res = await fetch('/api/posts/create',{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({postedBy:user?._id, text:postText, img:imgUrl})
         })
         const data = await res.json()
         console.log(data)
         if(res.ok){
          toast({
            title:"Success",
            description:"Post created successfully",
            status:"success"
          })
          setPosts([data, ...posts])
          onClose() 
          setPostText('')
          setImgUrl('')
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
      }finally{
        setLoading(false)
      }
    }
  return (
    <>
        <Button
          position={'fixed'}
          bottom={10}
          right={10}
          bg={useColorModeValue('gray.300', 'gray.dark')}
          onClick={onOpen}
        >
          <AddIcon/>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} >
            <FormControl>
                <Textarea placeholder='Post Content Goes here...' 
                onChange={handleTextChange}
                value={postText}
                />
                <Text fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                color={"gray.800"}
                >
                 {remainingChar}/{maxLength}
                </Text>
                <Input 
                type='file' 
                ref={imageRef}
                onChange={handleImageChange}
                hidden
                size={16}
               
                /> 
                <BsFillImageFill 
                 onClick={()=>imageRef.current.click()}
                style={{marginLeft:"5px",cursor:"pointer"}}
                />
            </FormControl>
            { imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"} >
                <Image src={imgUrl} alt='Selected Img' />
                <CloseButton onClick={()=>setImgUrl("")} bg={"gray.800"} position={"absolute"} top={2} right={2} />
              </Flex>
            ) }
          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} colorScheme='blue' mr={3} onClick={handleCreatePost} >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
