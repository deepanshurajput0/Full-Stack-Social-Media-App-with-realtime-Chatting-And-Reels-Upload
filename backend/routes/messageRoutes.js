import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getConversations, getMessages, sendMessage } from "../controllers/sendMessage.js";
const router = express.Router()

router.get('/conversations',authMiddleware,getConversations)
router.post('/',authMiddleware,sendMessage)
router.get('/:otherUserId',authMiddleware,getMessages)
export default router