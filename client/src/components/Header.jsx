import { Button, Flex, Image, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link } from 'react-router-dom'
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsFillChatQuoteFill } from 'react-icons/bs'
import { RiVideoUploadLine } from "react-icons/ri";
const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const user = useRecoilValue(userAtom)
    const logout = useLogout()
  return (
    <Flex style={!user ? {justifyContent:"center"}:{justifyContent:"space-between"}}  mt={"6"} mb={"12"}>
      {
        user && (
          <Link to='/' >
          <AiFillHome size={24} />
          </Link>
        )
      }
        <Image height={"40px"}  cursor={'pointer'} alt='logo' src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        />
            {
        user && (
         <Flex alignItems={'center'} gap={'4'} > 
           <Link to={`/${user.username}`} >
          <RxAvatar size={24} />
          </Link>
          <Link to={'/createreel'} >
          <RiVideoUploadLine size={25} />
          </Link>
          <Link to={'/reels'} >
           <BiSolidMoviePlay size={20}/>
          </Link>
           <Link to={`/chat`} >
          <BsFillChatQuoteFill size={20} />
          </Link>
          <Button  size={'sm'} onClick={logout} >
            <FiLogOut size={20} />
          </Button>
         </Flex>
        )
      }
    </Flex>
  )
}

export default Header


