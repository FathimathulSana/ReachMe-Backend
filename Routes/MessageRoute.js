import express from "express";
import { addMessage, getMessages } from "../Controllers/MessageController.js";
import authMiddleWare, { isActiveMiddleware } from "../MiddleWare/authMiddleWare.js";
const router = express.Router()

router.use(authMiddleWare, isActiveMiddleware)
router.post('/', addMessage)
router.get('/:chatId', getMessages)

export default router