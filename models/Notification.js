import mongoose, { model, models, Schema } from "mongoose";

const NotificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        containerId: {
            type: Schema.Types.ObjectId,
            ref: 'Container',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

const Notification = models.Notification || model('Notification', NotificationSchema);
export default Notification;