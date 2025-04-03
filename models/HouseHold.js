import mongoose, { model, models } from "mongoose";

const memberSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    notificationType: {
        type: String,
        enum: ['email', 'sms', 'both'],
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    }
});

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [memberSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Household = models.Household || model('Household', householdSchema);
export default Household;