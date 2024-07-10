import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    HStack,
    Avatar,
    Center,
  } from '@chakra-ui/react'
  import { useRef, useState } from 'react'
  import { useRecoilState } from 'recoil'
  import userAtom from '../atoms/userAtom'
  import usePreviewImg from '../hooks/usePreviewImg'
  import { useSetRecoilState } from 'recoil'
  import { useToast } from '@chakra-ui/react'
  
  export default function UpdateProfilePage() {
      const [user, setUser] = useRecoilState(userAtom)
      const [input,setInput] = useState({
          name:user.name,
          username:user.username,
          email:user.email,
          bio:user.bio,
          password:""
      })
      const fileRef = useRef(null)
      const {handleImageChange, imgUrl}  = usePreviewImg()
      const handleInput=(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setInput({
          ...input, [name]:value
        })
      }
      const setOurUser = useSetRecoilState(userAtom)
      const toast = useToast()
    const handleSubmit=async(e)=>{
      e.preventDefault()
      try {
       const res = await fetch(`/api/users/update/${user._id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({...input, profilePic:imgUrl})
       })
       const data = await res.json()
       if (!res.ok) {
        throw new Error(data.message || 'User Profile Error Try again');
      }
   
       setOurUser(data)
       localStorage.setItem("user-threads",JSON.stringify(data))
       toast({
        title:"Success",
        description:"Profile Updated Successfully",
        status:"success"
       })
       
      } catch (error) {
        if (error.message) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 3000
          });
        } else {
          // If there's no specific error message, display a generic error
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            status: "error",
            duration: 3000
          });
        }
      }
    }
    return (
     <form onSubmit={handleSubmit} >
       <Flex
        align={'center'}
        justify={'center'}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl mt={"5"} id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic}/>
              </Center>
              <Center w="full">
                <Button onClick={()=>fileRef.current.click()} w="full">Change Avatar</Button>
                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl >
            <FormLabel>Full Name</FormLabel>
            <Input
            value={input.name}
              placeholder="Full Name"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              name='name'
              onChange={handleInput}
            />
          </FormControl>
          <FormControl  >
            <FormLabel>User name</FormLabel>
            <Input
            value={input.username}
              placeholder="UserName"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              name='username'
              onChange={handleInput}
  
            />
          </FormControl>
          <FormControl  >
            <FormLabel>Email address</FormLabel>
            <Input
            value={input.email}
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              name='email'
              onChange={handleInput}
  
            />
          </FormControl>
          <FormControl >
            <FormLabel>Bio</FormLabel>
            <Input
            value={input.bio}
              placeholder="add bio"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              name='bio'
              onChange={handleInput}
  
            />
          </FormControl>
          <FormControl  >
            <FormLabel>Password</FormLabel>
            <Input
            value={input.password}
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              name='password'
              onChange={handleInput}
  
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
            type='submit'
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
     </form>
    )
  }
  