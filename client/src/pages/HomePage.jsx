import { Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const HomePage = () => {
  const [posts, setPosts]= useRecoilState(postsAtom)
  const [loading,setLoading] = useState(true)
  
  useEffect(()=>{
    const getFeedPosts =async()=>{
      setLoading(true)
       try {
        const res = await fetch('/api/posts/feed');
        const data = await res.json()
        setPosts(data)
       } catch (error) {
        console.log(error)
       }finally{
        setLoading(false)
       }
    }
    getFeedPosts()
  },[])
  return (
    <>
       { !loading && posts.length === 0 && <h1>Follow some users to see the feed</h1> }
    {
      loading && (
        <Flex justify={"center"} >
          <Spinner size={"xl"} />
        </Flex>
      )
    }
 {
    posts.length>0 && posts.map((post)=>(
    <Post key={post._id} post={post} postedBy={post.postedBy} />
  ))
 }
    </>
  )
}

export default HomePage
