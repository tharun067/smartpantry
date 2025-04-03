import mongoose, { model, models } from "mongoose";

const shoppingListItem = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {  // ✅ Store product name for faster lookup
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    purchased: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const shoppingListSchema = new mongoose.Schema({
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true  // ✅ Faster queries when fetching lists
    },
    items: [shoppingListItem],
    name: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {  // ✅ Track when the list was last modified
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const ShoppingList = models.ShoppingList || model('ShoppingList', shoppingListSchema);
export default ShoppingList;
