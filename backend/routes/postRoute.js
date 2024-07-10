import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeAndUnlike, replyToPost } from "../controllers/postController.js"

const router = express.Router()

router.get('/feed',authMiddleware,getFeedPosts)
router.post('/create',authMiddleware, createPost)
router.get('/:id',getPost)
router.get('/user/:username',getUserPosts)
router.delete('/:id', authMiddleware,deletePost)
router.put('/like/:id',authMiddleware,likeAndUnlike)
router.put('/reply/:id',authMiddleware,replyToPost)
export default router