import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,

        },
        password: {
            type: String,

        },
        firstname: {
            type: String,

        },
        lastname: {
            type: String,

        },
        email: {
            type: String,
            unique: true,
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesin: String,
        worksAt: String,
        relationship: String,
        country: String,
        followers: [],
        following: [],
        verified: Boolean,
        active: {
            type: Boolean,
            default: true
        },
        isFamous: {
            type: String,
            default: "notFamous"
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        }
    },
    { timestamps: true }
)

const UserModel = mongoose.model('Users', UserSchema);
export default UserModel;