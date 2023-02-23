import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: String,

    },
    description: String,
    likes: [],
    image: String,
    video: String,
    removed: {
        type: Boolean,
        default: false
    },
    reports: [{
        reportedUser: {
            type: String
        },
        reason: {
            type: String
        }
    }]
},
    {
        timestamps: true
    })

const PostModel = mongoose.model("Posts", postSchema)
export default PostModel;