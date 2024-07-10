import express from "express";
import { followUnfollowUser, getUsersProfile, logout, signUp, signin, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { replyToPost } from "../controllers/postController.js";
const router = express.Router()

router.get('/profile/:query', getUsersProfile)
router.post('/signup',signUp)
router.post('/signin',signin)
router.post('/logout',logout)
router.post('/follow/:id',authMiddleware,followUnfollowUser)
router.put('/update/:id',authMiddleware,updateUser)
router.post('/reply/:id',authMiddleware, replyToPost)
export default router