import mongoose, { model, models } from "mongoose";

const weightHistorySchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const containerSchema = new mongoose.Schema({
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    currentWeight: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    maxWeight: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    minWeight: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    alertWeight: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    unit: {
        type: String,
        enum: ['g', 'kg', 'm', 'l', 'L', 'items'],
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    weightHistory: [weightHistorySchema]
});

const Container = models.Container || model('Container', containerSchema);
export default Container;