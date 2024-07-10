import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
  import authScreenAtom from '../atoms/authAtom'
  import { useSetRecoilState} from 'recoil'
  import useShowToast from '../hooks/useShowToast'
  import userAtom from '../atoms/userAtom'
  import { useToast } from "@chakra-ui/react"
  import axios from 'axios'
//   import { baseUrl } from './BaseUrl'
  export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const [loading,setLoading] = useState(false)
    const [user, setUser] = useState({
      username:"",
      password:""
    })
    const toast = useToast()
    const handleInput=(e)=>{
      let name = e.target.name;
      let value = e.target.value;
      setUser({
        ...user, [name]:value
      })
    }
    const setOurUser = useSetRecoilState(userAtom)
    const handleLogin = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/users/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });
    
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to log in');
        }
    
        localStorage.setItem("user-threads", JSON.stringify(data));
        setOurUser(data);
      } catch (error) {
        // console.error(error);
    
        // Check if there's a specific error message from the backend
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
      }finally{
        setLoading(false)
      }
    };
    
    
    return (
      <Flex
        align={'center'}
        justify={'center'}
        >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            w={{
              base:"full",
              sm:"400px"
            }}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input 
                type="text"
                value={user.username}
                onChange={handleInput}
                name='username'
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                   value={user.password}
                   onChange={handleInput}
                   name='password'
                  type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Logging in"
                  size="lg"
                  onClick={handleLogin}
                  bg={useColorModeValue("gray.600","gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("gray.700","gray.800")
                  }}
                  isLoading={loading}
                  >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an account <Link onClick={()=>setAuthScreen('signup')} color={'blue.400'}>Sign up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }
  