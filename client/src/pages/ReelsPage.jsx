import { Flex, VStack, Text, Avatar, Button } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import './ReelsPage.css';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import Comment from './Comment';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
const ReelsPage = () => {
  const [reelData, setReelData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null); // Track current video index
  const user = useRecoilValue(userAtom)
  const [liked,setLiked] = useState()
  useEffect(() => {
    const getReelsdata = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/reels/get');
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setReelData(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getReelsdata();
  }, [user]);


 const likePost =async(id)=>{
   try {
    const res = await fetch(`/api/reels/like/${id}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      }
    })
    const data = await res.json()
     if(res.ok){
      const newData = reelData.map((reels)=>{
        if(reels?._id == data._id){
          return data
        }else{
          return reels
        }
      })
      setReelData(newData)
      
     }
   } catch (error) {
    console.log(error)
   }

 }
 const UnlikePost =async(id)=>{
   try {
    const res = await fetch(`/api/reels/unlike/${id}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      }
    })
    const data = await res.json()
     if(res.ok){
      const newData = reelData.map((reels)=>{
        if(reels?._id == data._id){
          return data
        }else{
          return reels
        }
      })
      setReelData(newData)
     }
   } catch (error) {
    console.log(error)
   }

 }

  const videoRefs = useRef([]);

  const handleVideoClick = (index) => {
    // Pause all videos except the clicked one
    videoRefs.current.forEach((video, i) => {
      if (i !== index) {
        video.pause();
      }
    });

    // Toggle play/pause for the clicked video
    const video = videoRefs.current[index];
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleScroll = () => {
    // Find the index of the video currently in view
    const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    // console.log(scrollPosition)
    const windowHeight = window.innerHeight;
    // console.log(windowHeight)
    let index = Math.floor((scrollPosition + windowHeight / 2) / windowHeight);
    // console.log(index)
    index = Math.max(0, Math.min(index, reelData.length - 1));

    if (index !== currentVideoIndex) {
      // Pause the previous video
      if (currentVideoIndex !== null) {
        videoRefs.current[currentVideoIndex].pause();
      }
      
      // Play the current video
      videoRefs.current[index].play();
      setCurrentVideoIndex(index);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
  }, [reelData,currentVideoIndex]); // Listen for scroll and reelData changes

  return (
    <Flex justifyContent="center" alignItems="center" minHeight="100vh">
      <VStack spacing={4} alignItems="center">
        {reelData.map((item, index) => (
          <div key={item?._id} style={{ position: 'relative', width: '100%' }}>
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="reels-video"
              src={item?.reel?.url}
              onClick={() => handleVideoClick(index)}
            />
            <div style={{position:'absolute', top:'45%',left:'82%',width:"100%",alignItems:'center',flexDirection:'column'}} >
              {
                item?.likes?.includes(user._id) ?  <div className="unlike">
                <FaHeart color='red' onClick={()=>{UnlikePost(item?._id)}} size={30} />
               </div> : <div onClick={()=>{likePost(item?._id)}} className="like">
                    <FaRegHeart  size={30} />
                  </div>
              }
                <div style={{marginTop:'10px'}} >{item?.likes?.length} Likes</div>  
                 <div style={{marginTop:"40px"}} >
                  {/* <BiCommentDetail size={30} /> */}
                  <Comment reelData={reelData} setReelData={setReelData} reelId={item?._id} item={item}  />
                 </div>
            </div>
            <div className="user-info" style={{ position: 'absolute', bottom: '5%', left: '5%', width: '100%',  }}>
              <Flex alignItems="center" gap={2}>
                <Avatar src={item?.profile} />
                <Text>{item?.ouruser}</Text>
                <Link to={`/${item?.ouruser}`}>
                  <Button>Visit Profile</Button>
                </Link>
                
              </Flex>
              <Text>{item?.caption}</Text>
            </div>
          </div>
        ))}
      </VStack>
    </Flex>
  );
};

export default ReelsPage;
