import express from "express";
import { createComment, deleteComment, editComment, getComments } from '../Controllers/CommentController.js';
import { authMiddleWare, isActiveMiddleware } from "../MiddleWare/authMiddleWare.js";
const router = express.Router();

router.use(authMiddleWare, isActiveMiddleware)
router.post('/:id', createComment)
router.get('/:id', getComments)
router.delete('/:commentId', deleteComment)
router.post('/edit/comment', editComment)

export default router;
