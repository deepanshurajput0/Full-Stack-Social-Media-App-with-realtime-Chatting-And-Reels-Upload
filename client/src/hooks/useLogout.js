import React from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast'
import axios from 'axios'
const useLogout = () => {
    const showToast = useShowToast()
    const setUser = useRecoilState(userAtom)
        const logout =async()=>{
            try {
                const res = await axios.post(`/api/users/logout`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
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
    return logout
}

export default useLogout