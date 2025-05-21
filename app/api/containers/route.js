import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Container from "@/models/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const householdId = searchParams.get('householdId');

        if (!householdId) {
            return NextResponse.json({ message: 'Household Id is required' }, { status: 400 });
        }

        await connectToDB();

        const containers = await Container.find({ householdId });
        return NextResponse.json(containers);
    } catch (error) {
        console.error('Error fetching containers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Validate input

        const { name, householdId, currentWeight, maxWeight, minWeight, alertWeight, unit, isNew } = data;
        if (!name || !householdId || currentWeight === undefined || maxWeight === undefined || minWeight === undefined || alertWeight === undefined || !unit) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDB();

        // Create container with initial weight history

        const container = new Container({
            name,
            householdId,
            currentWeight,
            maxWeight,
            minWeight,
            alertWeight,
            unit,
            isNew,
            weightHistory: [
                {
                    weight: currentWeight,
                    date: new Date()
                }
            ]
        });

        await container.save();

        return NextResponse.json({ message: 'Container create successfully', container },{status:201});
    } catch (error) {
        console.error('Error fetching containers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}