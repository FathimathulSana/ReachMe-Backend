import nodeMailer from 'nodemailer'
import bcrypt, { genSalt } from 'bcrypt'
import OtpModel from '../Models/otpModel.js'
import * as dotenv from 'dotenv'
dotenv.config()

//Nodemailer stuff
let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_PASSWORD
    }
})

//testing success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for message");
        console.log(success)
    }
})

//send otp verification email
export const sendOtpVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup</p>
            <p>This code <b>expires in 1 hour </b>.</p>`
        }

        //hash the otp
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const newOTPVerification = await new OtpModel({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        })

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions)
        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: _id,
                email
            }
        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}