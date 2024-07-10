import React from 'react'
import SignupCard from '../components/SignUpCard'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import Login from '../components/Login'
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    
  return (
    <div>
        { authScreenState === 'login' ? <Login/> : <SignupCard/> }
    </div>
  )
}

export default AuthPage


