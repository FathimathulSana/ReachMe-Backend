import UserModel from "../Models/userModel.js";
import AdminnotificationModel from "../Models/AdminnotificationModel.js";
import UserNotifications from "../Models/UserNotificationModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

//get all users
export const getAllUsers = async (req, res) => {
    try {
        let users = await UserModel.find();
        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

//get a user
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id)
        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//Update a user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { _id, currentUserAdminStatus, password } = req.body;
    if (id === _id) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt)
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
            const token = jwt.sign(
                { username: user.username, id: user._id },
                process.env.JWT_KEY, { expiresIn: '1h' }
            )
            res.status(200).json({ user, token })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only update your own profile")
    }
}


//Follow User
export const followUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(_id)
            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } })
                await followingUser.updateOne({ $push: { following: id } })
                const notification = new UserNotifications({
                    recipientId: followUser,
                    senderId: followingUser,
                    message: `@${followingUser.username} started following you`,
                    type: 'follow'
                });
                await notification.save();
                console.log("keri");
                res.status(200).json("User followed!")
            } else {
                res.status(403).json("User is Already followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

//UnFollow User
export const unFollowUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(_id)
            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } })
                await followingUser.updateOne({ $pull: { following: id } })
                res.status(200).json("User Unfollowed!")
            } else {
                res.status(403).json("User is Not followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

// search user
export const getUserData = async (req, res) => {
    const { data } = req.body
    const peopleData = await UserModel.find({ "username": new RegExp(data, 'i') })
    res.json(peopleData.slice(0, 10))
}



//request for setting user account verified with blue tick
export const isFamousRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const requests = await AdminnotificationModel.find()
        if (requests[0].verificationRequests.includes(id)) {
            return res.status(400).json("verification")
        } else {
            await requests[0].updateOne({ $push: { verificationRequests: id } })
            await UserModel.findByIdAndUpdate(id, { $set: { isFamous: "pending" } }, { new: true })
            res.status(200).json("request send")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//get notifications
export const getNotifications = async (req, res) => {
    try {
        const recipientId = req.params.id;
        const notifications = await UserNotifications.find({ recipientId }).sort({ createdAt: -1 });
        res.json(notifications)
    } catch (error) {
        res.status(500).send('Internal Server error')
    }
}
//remove notification
export const removeNotification = async (req, res) => {
    try {
        const id = req.params.id
        const notificationRemoved = await UserNotifications.findByIdAndDelete(id)
        res.status(200).json("Notification Removed")

    } catch (error) {
        res.status(500).json(error)
    }
}


