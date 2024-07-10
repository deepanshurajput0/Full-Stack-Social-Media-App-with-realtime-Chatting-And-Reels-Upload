import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import { useRecoilValue } from "recoil"
import Header from "./components/Header"
import AuthPage from "./pages/AuthPage"
import userAtom from "./atoms/userAtom"
import HomePage from "./pages/HomePage"
import LogoutButton from "./components/LogoutButton"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/CreatePost"
import ChatPage from "./pages/ChatPage"
import ReelsPage from "./pages/ReelsPage"
import CreateReel from "./pages/CreateReel"
function App() {
 const user = useRecoilValue(userAtom)
  return (
    <Box position={'relative'} w={'full'} >
    <Container maxW={'620px'} >
      <Header/>
      <Routes>
        <Route path="/" element={ user ? <HomePage/> : <Navigate to='/auth' />} />
        <Route path="/update" element={ user ? <UpdateProfilePage/> : <Navigate to='/auth' />} />
        <Route path="/:username" element={  user ? ( <> <UserPage/> <CreatePost/> </> ) : ( <UserPage/> )}  />
        <Route path="/:username/post/:pid" element={<PostPage/>}  />
        <Route path="/chat" element={ user ? <ChatPage/> : <Navigate to={'/auth'} /> }  />
        <Route path="/auth" element={ !user ? <AuthPage/> : <Navigate to='/' />} />
        <Route path="/reels" element={ user ? <ReelsPage/> : <Navigate to='/' />} />
        <Route path="/reels" element={ user ? <ReelsPage/> : <Navigate to='/' />} />
        <Route path="/createreel" element={ user ? <CreateReel/> : <Navigate to='/' />} />
      </Routes>
      
    </Container>
    </Box>
  )
}

export default App
