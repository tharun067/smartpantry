import { connectToDB } from "@/config/db";
import ShoppingList from "@/models/ShoppingList";
import { NextResponse } from "next/server";

// Add an Item to an Existing Shopping List
export async function POST(request) {
    await connectToDB();
    try {
        const { shoppingListId, item } = await request.json();

        if (!shoppingListId || !item?.productName || !item?.quantity) {
            return NextResponse.json({ error: "Shopping List ID and item details are required" }, { status: 400 });
        }

        const shoppingList = await ShoppingList.findById(shoppingListId);
        if (!shoppingList) {
            return NextResponse.json({ error: "Shopping list not found" }, { status: 404 });
        }

        shoppingList.items.push(item);
        await shoppingList.save();

        return NextResponse.json(shoppingList, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
    }
}
