import { connectToDB } from '@/config/db';
import ShoppingList from '@/models/ShoppingList';
import { NextResponse } from 'next/server';

// Fetch Shopping History
export async function GET(request) {
    await connectToDB();
    try {
        const { searchParams } = new URL(request.url);
        const householdId = searchParams.get('householdId');

        if (!householdId) {
            return NextResponse.json({ error: 'Household ID is required' }, { status: 400 });
        }

        const historyLists = await ShoppingList.find({
            householdId,
            completed: true,
        }).sort({ createdAt: -1 }).populate('items.productId');

        return NextResponse.json(historyLists, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch shopping history' }, { status: 500 });
    }
}
