import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
}, {
    timestamps: true
})

adminSchema.pre("save", async (next) => {
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const AdminModel = mongoose.model("Admin", adminSchema)
export default AdminModel;