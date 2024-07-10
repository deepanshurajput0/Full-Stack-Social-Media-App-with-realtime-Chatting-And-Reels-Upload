import { Button, Input, Stack,Text, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

const CreateReel = () => {
 const [caption, setCaption] = useState('')
 const [reel, setReel] = useState('')
 const [reelPrev,setReelPrev] = useState('')
 const [loading,setLoading] = useState(false)
 const toast = useToast()
 const changeReelHandler =(e)=>{
   const file = e.target.files[0]
   const reader = new FileReader()
   reader.readAsDataURL(file)
   reader.onloadend=()=>{
    setReelPrev(reader.result)
    setReel(file)
   }
 }


 const handleCreateReel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('file', reel);
  
      const res = await fetch('/api/reels/create', {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: "Reel Uploaded successfully",
          status: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Stack>
        <Text  children='Upload Your Reels' />
        <form onSubmit={handleCreateReel} >
         <VStack  mt={'10'} >
            <Input 
            placeholder='Add Caption to reel'
            onChange={(e)=>setCaption(e.target.value)}
            value={caption}
            />
            <Input 
             mt={'10'}
             accept='video/*'
             required
             type='file'
             onChange={changeReelHandler}
            />{
                reelPrev && <video src={reelPrev} controls ></video>
            }
         </VStack>
         <Button type='submit' isLoading={loading} mt={'10'} >Upload Reel</Button>
        </form>
    </Stack>
  )
}

export default CreateReel



