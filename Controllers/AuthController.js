import UserModel from "../Models/userModel.js";
import AdminModel from "../Models/adminModel.js"
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpVerificationEmail } from "../Services/NodeMailer.js";

//Registering a new user
export const registerUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    req.body.verified = false;
    const newUser = new UserModel(req.body)
    const { email } = req.body
    try {
        const oldUser = await UserModel.findOne({ email })
        if (oldUser) {
            return res.status(400).json({ message: "User is already registered!" })
        }
        const user = await newUser.save();
        await sendOtpVerificationEmail(user, res);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username: username })
        if (user) {
            if (!user.verified) {
                return res.status(400).json("User otp not verified")
            }
            const validity = await bcrypt.compare(password, user.password)
            if (!validity) {
                res.status(400).json("Wrong Password!")
            } else {
                const active = user.active
                if (!active) {
                    return res.status(400).json("You has been blocked")
                }
                const token = jwt.sign({
                    username: user.username, id: user._id
                }, process.env.JWT_KEY, { expiresIn: '1h' })
                res.status(200).json({ user, token })
            }
        } else {
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminData = await AdminModel.findOne({ username: username }, { username: 1, password: 1 });
        if (adminData) {
            const adminVerified = await bcrypt.compare(password, adminData.password);
            if (adminVerified) {
                let token
                if (process.env.JWT_KEY) {
                    token = jwt.sign(
                        { username: adminData.username, id: adminData._id },
                        process.env.JWT_KEY,
                        { expiresIn: "1h" }
                    );
                }
                return res.status(200).json({ adminData, token })
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

