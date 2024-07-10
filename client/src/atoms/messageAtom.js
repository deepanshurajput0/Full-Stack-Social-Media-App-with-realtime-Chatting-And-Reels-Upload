import { atom } from 'recoil'

const conversationAtom = atom({
    key:'conversationAtom',
    default:[],

})

export const selectedConversationAtom = atom({
    key:'selectedConversation',
    default:{
        _id:"",
        userId:"",
        username:"",
        userProfilePic:""
    }
}) 




export default conversationAtom

