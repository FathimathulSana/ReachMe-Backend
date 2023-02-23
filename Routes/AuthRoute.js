import express from "express";
import { adminLogin, loginUser, registerUser } from "../Controllers/AuthController.js";
import { resendOtp, verifyotp } from "../Controllers/OtpController.js";
import { resetPass, resetPassword, updatePassword } from '../Controllers/ResetController.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verifyotp', verifyotp)
router.post('/resendotp', resendOtp)
router.post('/adminLogin', adminLogin);
router.post('/forgotpassword', resetPass)
router.put('/resetPasswordForm', resetPassword)
router.post('/updatepass/:id', updatePassword)


export default router