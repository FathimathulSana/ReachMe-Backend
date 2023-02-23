import mongoose from 'mongoose';

const UserNotificationSchema = mongoose.Schema({
    
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['follow', 'like', 'comment'],
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });


const UserNotifications = mongoose.model("UserNotifications", UserNotificationSchema)
export default UserNotifications;


 

