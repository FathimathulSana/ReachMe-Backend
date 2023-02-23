import express from "express";
import { blockuser, getVerifyNotifications, makeIsFamous } from "../Controllers/AdminController.js";
import { followUser, getAllUsers, getNotifications, getUser, getUserData, isFamousRequest, removeNotification, unFollowUser, updateUser } from "../Controllers/UserController.js";
import { authMiddleWare, isActiveMiddleware } from "../MiddleWare/authMiddleWare.js";
const router = express.Router();

router.use(authMiddleWare)
router.get('/', getAllUsers)
router.get('/:id', isActiveMiddleware, getUser)
router.put('/:id', isActiveMiddleware, updateUser)
router.put('/:id/follow', isActiveMiddleware, followUser)
router.put('/:id/unfollow', isActiveMiddleware, unFollowUser)
router.post('/blockuser/:id', blockuser)
router.post('/getdata', getUserData)
router.post('/isfamousrequest/:id', isActiveMiddleware, isFamousRequest)
router.get('/getnotifications/:id', isActiveMiddleware, getNotifications)
router.delete('/removenotification/:id', isActiveMiddleware, removeNotification)
router.post('/getverifynotifications', getVerifyNotifications)
router.post('/makeisfamous/:id', makeIsFamous)

export default router;