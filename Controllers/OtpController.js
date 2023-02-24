import OtpModel from "../Models/otpModel.js";
import UserModel from '../Models/userModel.js'
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';

//verify otp email
export const verifyotp = async (req, res) => {
    try {
        let { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json("Empty otp details are not allowed");
        } else {
            const userOTPVerificationRecords = await OtpModel.find({ userId });
            if (userOTPVerificationRecords.length <= 0) {
                //no records found
                return res.status(400)
                    .json("Account record doesn't exist or have been verified already, please signup or login")
            } else {
                const { expiresAt } = userOTPVerificationRecords[0];
                const hashedOTP = userOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    //user otp record has expired
                    await OtpModel.deleteMany({ userId });
                    return res.status(404).json("Code has expired. Please request again.")

                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);
                    if (!validOTP) {
                        //supplied otp is wrong
                        return res.status(404).json(" Invalid code passed!. Check your inbox.")
                    } else {
                        await UserModel.findOneAndUpdate(
                            { _id: userId },
                            { $set: { verified: true } }
                        );
                        const user = await UserModel.findById({ _id: userId });
                        await OtpModel.deleteMany({ userId });
                        const token = jwt.sign(
                            {
                                username: user.username,
                                id: user._id
                            },
                            process.env.JWT_KEY,
                            { expiresIn: '1h' }
                        );
                        res.status(200).json({ user, token })
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
}

//resend otp

export const resendOtp = async (req, res) => {
    try {
        let { userId, email } = req.body;
        if (!userId || !email) {
            throw Error("Empty user details are not allowed");
        } else {
            //delete existing record and resend
            await OtpModel.deleteMany({ userId });
            sendOtpVerificationEmail({ _id: userId, email: email }, res);
        }
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
}
