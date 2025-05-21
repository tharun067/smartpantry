import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            default: null
        },
        isHouseHead: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

// Hash password before saving

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model('User', UserSchema);
export default User;