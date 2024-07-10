import express from "express"
import { createReelController, getAllReels, Like, Unlike,Comment} from "../controllers/reelsController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import singleUpload from "../middlewares/multer.js"
const router = express.Router()


router.post('/create',authMiddleware,singleUpload,createReelController)
router.get('/get',authMiddleware,getAllReels)
router.put('/like/:id',authMiddleware,Like)
router.put('/unlike/:id',authMiddleware,Unlike)
router.put('/comment/:id',authMiddleware,Comment)
export default router

