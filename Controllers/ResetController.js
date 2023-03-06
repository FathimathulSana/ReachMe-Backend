import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import UserModel from '../Models/userModel.js'

//resetPass
export const resetPass = async (req, res) => {
    try {
        const email = req.body.email
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ error: true, message: 'No user found with this email address' });
        }
        //Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        //send password reset email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.FROM_PASSWORD
            }
        });
        const mailOptions = {
            to: user.email,
            from: process.env.FROM_EMAIL,
            subject: "Password Reset Request",
            text: `You are receiving this email because you has requested to reset your password. Please click on the following link or paste it into your browser to reset your password :\n\n
            https://main.reachmee.thesak.online/resetpass/${token}\n\n
            If you did not request this, Please ignore this email and your password will remain unchanged.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email' });
            }
            return res.status(200).json({ error: false, message: 'password reset email sent', token });
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

//route for setting password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        //update the user's password
        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'password has been reset successfully' });
    } catch (error) {
        res.status(500).json(error)
    }
}

//update password of user
export const updatePassword = async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        const verify = await bcrypt.compare(oldpassword, user.password);
        if (!verify) {
            res.status(401).json({ message: 'Old password is incorrect' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(newpassword, salt);
            await UserModel.findByIdAndUpdate(id, { password: hashedPass });
            res.status(200).json({ message: 'Password updated' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}