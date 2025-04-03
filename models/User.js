import mongoose, { model, models } from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household'
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
});

const User = models.User || model('User', userSchema);
export default User;  // Export the User model