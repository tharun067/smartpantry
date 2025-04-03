import { connectToDB } from "@/config/db";
import Container from "@/models/container";
import ShoppingList from "@/models/ShoppingList";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
export async function GET(req) {
    await connectToDB();

    try {
        const { searchParams } = new URL(req.url);
        const householdId = searchParams.get('householdId');

        if (!householdId) {
            return NextResponse.json({ error: 'Household ID is required' }, { status: 400 });
        }

        // Ensure `householdId` is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(householdId)) {
            return NextResponse.json({ error: 'Invalid Household ID format' }, { status: 400 });
        }

        const shoppingList = await ShoppingList.findOne({ householdId, completed: false })
            .populate('items.productId')
            .populate('items.addedBy');

        return NextResponse.json(shoppingList || { items: [] });
    } catch (error) {
        console.error("Error fetching shopping list:", error.message);
        return NextResponse.json({ error: 'Failed to fetch shopping list', details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectToDB();

    try {
        const { householdId } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(householdId)) {
            return NextResponse.json({ error: 'Invalid Household ID format' }, { status: 400 });
        }

        // Find containers that are below the alert threshold
        const lowStockContainers = await Container.find({
            householdId,
            $expr: { $lte: ["$currentWeight", "$alertWeight"] } // Compare the fields directly
        }).populate('productId');
        
        

        if (lowStockContainers.length === 0) {
            return NextResponse.json({ message: 'No low-stock containers found' }, { status: 200 });
        }

        // Find or create a shopping list
        let shoppingList = await ShoppingList.findOne({ householdId, completed: false });

        if (!shoppingList) {
            shoppingList = new ShoppingList({ householdId, items: [] }); // ✅ Fix `items` instead of `item`
        }

        // Add low-stock items to the shopping list
        for (const container of lowStockContainers) {
            const existingItem = shoppingList.items.find(item => item.productId.equals(container.productId._id));
            if (!existingItem) {
                const suggestedQuantity = container.maxWeight - container.currentWeight;
                shoppingList.items.push({
                    productId: container.productId._id,
                    productName: container.productId.name, // ✅ Store product name for efficiency
                    quantity: suggestedQuantity,
                    unit: container.unit,
                    addedBy: null, // System-generated
                });
            }
        }

        await shoppingList.save();
        return NextResponse.json(shoppingList, { status: 201 });
    } catch (error) {
        console.error("Error creating/updating shopping list:", error.message);
        return NextResponse.json({ error: 'Failed to update shopping list', details: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDB();
    
    try {
        const { shoppingListId, itemId, purchased } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(shoppingListId) || !mongoose.Types.ObjectId.isValid(itemId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const shoppingList = await ShoppingList.findOneAndUpdate(
            { _id: shoppingListId, "items._id": itemId },
            { $set: { "items.$.purchased": purchased } },
            { new: true }
        ).populate("items.productId");

        if (!shoppingList) {
            return NextResponse.json({ error: 'Shopping list or item not found' }, { status: 404 });
        }

        return NextResponse.json(shoppingList);
    } catch (error) {
        console.error("Error updating shopping list:", error.message);
        return NextResponse.json({ error: 'Failed to update shopping list', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectToDB();

    try {
        const { searchParams } = new URL(req.url);
        const shoppingListId = searchParams.get('shoppingListId');

        if (!shoppingListId || !mongoose.Types.ObjectId.isValid(shoppingListId)) {
            return NextResponse.json({ error: 'Invalid or missing Shopping List ID' }, { status: 400 });
        }

        const deletedList = await ShoppingList.findByIdAndDelete(shoppingListId);

        if (!deletedList) {
            return NextResponse.json({ error: 'Shopping List not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting shopping list:", error.message);
        return NextResponse.json({ error: 'Failed to delete shopping list', details: error.message }, { status: 500 });
    }
}
