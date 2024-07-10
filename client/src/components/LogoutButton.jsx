import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import axios from 'axios'
// import { baseUrl } from './BaseUrl'
import useShowToast from '../hooks/useShowToast'
// import {  } from '@chakra-ui/icons'
const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()
    const handleLogout=async()=>{
        try {
            const res = await axios.post(`/api/users/logout`)
            localStorage.removeItem('user-threads')
            setUser(null)

        } catch (error) {
            if(error.response && error.response.data.message){
                showToast("Error",data.error, "error")
            }else{
                console.log(error)
            }
        }
    }
  return (
    <Button onClick={handleLogout}  position={"fixed"} top={"30"} right={"30px"} size={"sm"} >
       Logout 
    </Button>
  )
}

export default LogoutButton


