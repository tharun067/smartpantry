import { connectToDB } from "@/config/db";
import Container from "@/models/container";
import Product from "@/models/Product";
import ShoppingList from "@/models/ShoppingList";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectToDB();

    try {
        const { searchParams } = new URL(req.url);
        const householdId = searchParams.get('householdId');

        if (!householdId) {
            return NextResponse.json({ error: 'Household ID is required' }, { status: 400 });
        }

        const containers = await Container.find({ householdId }).populate('productId').lean();

        if (!containers) {
            return NextResponse.json({ error: 'No containers found' }, { status: 404 });
        }

        // ✅ Convert Decimal128 fields to strings
        const formattedContainers = containers.map(container => ({
            ...container,
            currentWeight: container.currentWeight?.toString(), 
            maxWeight: container.maxWeight?.toString(),
            minWeight: container.minWeight?.toString(),
            alertWeight: container.alertWeight?.toString(),
        }));

        return NextResponse.json(formattedContainers);
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ error: 'Failed to fetch containers' }, { status: 500 });
    }
}


import mongoose from "mongoose";

export async function POST(req) {
    await connectToDB();

    try {
        const containerData = await req.json();
        const { householdId, productId, productName, currentWeight, maxWeight, minWeight, alertWeight, unit } = containerData;

        if (!householdId || !productId || !currentWeight || !maxWeight || !minWeight || !alertWeight) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const container = new Container({
            householdId,
            productId,
            currentWeight: mongoose.Types.Decimal128.fromString(currentWeight.toString()), // ✅ Convert to Decimal128
            maxWeight: mongoose.Types.Decimal128.fromString(maxWeight.toString()),
            minWeight: mongoose.Types.Decimal128.fromString(minWeight.toString()),
            alertWeight: mongoose.Types.Decimal128.fromString(alertWeight.toString()),
            unit,
            lastUpdated: new Date(),
        });

        await container.save();
        return NextResponse.json(container, { status: 201 });
    } catch (error) {
        console.error('Error creating container:', error.message);
        return NextResponse.json({ error: 'Failed to create container', details: error.message }, { status: 500 });
    }
}


export async function PUT(req) {
    await connectToDB();

    try {
        const { containerId, currentWeight } = await req.json();

        if (!containerId || !currentWeight) {
            return NextResponse.json({ error: 'Container ID and current weight are required' }, { status: 400 });
        }

        // Get current container data
        const container = await Container.findById(containerId);
        if (!container) {
            return NextResponse.json({ error: 'Container not found' }, { status: 404 });
        }

        // Update container's weight and history
        const updatedContainer = await Container.findByIdAndUpdate(
            containerId,
            {
                $set: { currentWeight, lastUpdated: new Date() },
                $push: { weightHistory: { weight: currentWeight, timestamp: new Date() } }
            },
            { new: true }
        );

        // Check if the weight falls below the alert threshold
        if (currentWeight <= container.alertWeight && currentWeight >= container.minWeight) {
            let shoppingList = await ShoppingList.findOne({
                householdId: container.householdId,
                completed: false,
            });

            if (!shoppingList) {
                // If no active shopping list exists, create a new one
                shoppingList = new ShoppingList({
                    householdId: container.householdId,
                    items: [],
                    name: 'Auto-generated shopping list',
                });
                await shoppingList.save();
            }

            // Check if the product is already in the shopping list
            const existingItem = shoppingList.items.find(item => 
                item.productId.toString() === container.productId.toString()
            );

            if (!existingItem) {
                const suggestedQuantity = container.maxWeight - currentWeight;
                await ShoppingList.findByIdAndUpdate(shoppingList._id, {
                    $push: {
                        items: {
                            productId: container.productId,
                            productName: container.productName || "Unknown", // Ensure productName is added
                            quantity: suggestedQuantity,
                            unit: container.unit,
                            addedBy: null,
                        }
                    }
                });
            }
        }

        return NextResponse.json(updatedContainer);
    } catch (error) {
        console.error('Error updating container:', error.message);
        return NextResponse.json({ error: 'Failed to update container', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectToDB();

    try {
        const { searchParams } = new URL(req.url);
        const containerId = searchParams.get('containerId');

        await Container.findByIdAndDelete(containerId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete container' }, { status: 500 });
    }
}