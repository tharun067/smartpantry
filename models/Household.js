import mongoose, { model, models, Schema } from "mongoose";

const HouseholdSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        head: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    { timestamps: true }
);

const Household = models.Household || model('Household', HouseholdSchema);
export default Household;