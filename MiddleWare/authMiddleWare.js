import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../Models/userModel.js";
dotenv.config();

const secret = process.env.JWT_KEY;
export const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, secret)
            if (decoded) {
                req.user = decoded
                req.body._id = decoded?.id;
                next();
            }
        }
    } catch (error) {
        res.status(500).json("token expired")
    }
}

export const isActiveMiddleware = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id)
        if (user.active) {
            return next()
        }
        return res.status(400).json({ message: "Account is blocked", isBlocked: true })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}
export default authMiddleWare;