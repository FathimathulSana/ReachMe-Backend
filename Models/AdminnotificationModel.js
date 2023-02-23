import mongoose from 'mongoose';

const AdminnotificationSchema = mongoose.Schema({
    verificationRequests: []
})

const AdminnotificationModel = mongoose.model("Adminnotification", AdminnotificationSchema)
export default AdminnotificationModel;