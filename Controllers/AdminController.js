import UserModel from "../Models/userModel.js";
import AdminnotificationModel from "../Models/AdminnotificationModel.js";
import PostModel from "../Models/postModel.js";


export const viewAllUsers = async (req, res) => {
    try {
        const usersList = await UserModel.find({}, { username: 1, firstname: 1, lastname: 1, block: 1 }).lean();
        res.status(200).json({ usersList })
    } catch (error) {
        res.status(500).send(error)
    }
}

//block user
export const blockuser = async (req, res) => {
    const active = req.body.data
    try {

        active ? await UserModel.findByIdAndUpdate(req.params.id, { $set: { active: false } }, { new: true }) :
            await UserModel.findByIdAndUpdate(req.params.id, { $set: { active: true } }, { new: true });
        active ? res.status(200).json('user blocked') : res.status(200).json('user unblocked');
    } catch (error) {
        res.status(500).json(error)
    }
}

//get verify notifications for admin
export const getVerifyNotifications = async (req, res) => {
    try {
        const adminNotifications = await AdminnotificationModel.find()
        const verificationNotifications = adminNotifications[0].verificationRequests
        res.status(200).json(verificationNotifications)
    } catch (error) {
        res.status(500).json(error)
    }
}

//admin making user is famous true
export const makeIsFamous = async (req, res) => {
    const id = req.params.id
    try {
        const userUpdated = await UserModel.findByIdAndUpdate(id, { $set: { isFamous: "true" } }, { new: true })
        const adminNotificationsUpdated = await AdminnotificationModel.updateOne({ $pull: { verificationRequests: id } })
        res.status(200).json("user acount is verified now")
    } catch (error) {
        res.status(500).json(error)
    }
}

//show reported posts for admin
export const getReportedPosts = async (req, res) => {
    const posts = await PostModel.find()
    const reportedPosts = posts.filter((post) => post.reports.length > 0)
    res.status(200).json(reportedPosts)
}

export const reportedPostRemove = async (req, res) => {
    const postId = req.params.id
    try {
        const removedFieldUpdate = await PostModel.findById(postId)
        if (removedFieldUpdate.removed) {
            const response = await removedFieldUpdate.updateOne({ $set: { removed: false } })
            res.status(200).json("post unblocked")
        } else {
            const response = await removedFieldUpdate.updateOne({ $set: { removed: true } })
            res.status(200).json("post blocked successfully")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
