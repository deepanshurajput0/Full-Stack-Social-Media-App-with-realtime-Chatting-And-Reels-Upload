import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent,ModalHeader, ModalFooter,ModalBody, Button, ModalCloseButton, useDisclosure, Input, HStack, Avatar,Text } from '@chakra-ui/react'
import { BiCommentDetail } from "react-icons/bi";


const Comment = ({item,setReelData,reelData}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [text, setText] = useState('')
    const [loading,setLoading] = useState(false)
    const makeComment=async(reelId)=>{
        setLoading(true)
        try {
            const res = await fetch(`/api/reels/comment/${reelId}`,{
              method:'PUT',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({
                text:text
              })
            })
            const data = await res.json()
            if(res.ok){
                setText('')
                const newData = reelData.map((reels)=>{
                    if(reels._id== data._id){
                      return data
                    }else{
                      return reels
                    }
                  })
                  setReelData(newData)
            }
           } catch (error) {
            console.log(error)
           }finally{
            setLoading(false)
           }
    }
  return (
    <div >
    <div onClick={onOpen}>
        <BiCommentDetail size={30}/>
        <Text ml={'10px'} >{item?.comments?.length}</Text>
    </div>

<Modal  isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent position={'absolute'} bottom={'20%'} height={'450px'} >
    <ModalHeader>Comments</ModalHeader>
    <ModalCloseButton />
    <ModalBody overflowY={'auto'} >

         {
             item.comments && item?.comments.map((data,i)=>(
                <div key={i} >
                <HStack  >
                  <Avatar src={data?.userProfilePic} />
                  <span  style={{fontSize:'14px',marginTop:"0px"}}>{data?.username}</span>
                 </HStack>
                 <Text ml={'50px'} mt={'0'} >{data?.text}</Text>
                </div>
            ))
         }

    </ModalBody>

    <ModalFooter>
    <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder='Add a comment....' /> <Button isLoading={loading} onClick={()=>makeComment(item._id)} ml={'10px'} >Add</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default Comment

