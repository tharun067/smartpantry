import mongoose, { model, models } from 'mongoose'

const notificationSchema = new mongoose.Schema({
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'alert', 'success'],
        default: 'info'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: Object,
        default: {}
    }
}, { timestamps: true }
);
const Notification = models.Notification || model('Notification', notificationSchema);
export default Notification;