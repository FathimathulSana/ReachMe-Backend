import express from "express";
import { getReportedPosts, reportedPostRemove } from "../Controllers/AdminController.js";
import { createPost, deletePost, editPost, getPost, getTimelinePosts, likePost, reportPost } from "../Controllers/PostController.js";
import { authMiddleWare, isActiveMiddleware } from "../MiddleWare/authMiddleWare.js";
const router = express.Router()

router.use(authMiddleWare)
router.post('/', isActiveMiddleware, createPost)
router.get('/:id', isActiveMiddleware, getPost)
router.post('/:id/delete', isActiveMiddleware, deletePost)
router.put('/:id/like', isActiveMiddleware, likePost)
router.get('/:id/timeline', isActiveMiddleware, getTimelinePosts)
router.post('/report/:id', isActiveMiddleware, reportPost)
router.post('/edit/post', isActiveMiddleware, editPost)
router.post('/getreportedposts', getReportedPosts)
router.post('/reportedpostremove/:id', reportedPostRemove)

export default router;