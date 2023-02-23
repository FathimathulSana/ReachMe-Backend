import express from 'express'
import { createChat, findChat, userChats } from '../Controllers/ChatController.js'
import { authMiddleWare, isActiveMiddleware } from "../MiddleWare/authMiddleWare.js";
const router = express.Router()

router.use(authMiddleWare, isActiveMiddleware)
router.post('/', createChat)
router.get('/:userId', userChats)
router.get('/find/:firstId/:secondId', findChat)

export default router