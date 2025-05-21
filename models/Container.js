import mongoose, { model, models, Schema } from "mongoose";

const ContainerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            required: true
        },
        currentWeight: {
            type: Number,
            required: true
        },
        maxWeight: {
            type: Number,
            required: true
        },
        minWeight: {
            type: Number,
            required: true
        },
        alertWeight: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true,
            default: 'g'
        },
        isNew: {
            type: Boolean,
            default: true
        },
        weightHistory: [
            {
                weight: {
                    type: Number,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
);

const Container = models.Container || model('Container', ContainerSchema);
export default Container;