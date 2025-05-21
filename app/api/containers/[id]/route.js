import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Container from "@/models/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        await connectToDB();

        const container = await Container.findById(id);

        if (!container) {
            return NextResponse.json({ message: 'Container not found' }, { status: 404 });
        }
        return NextResponse.json(container);
    } catch (error) {
        console.error("Error fetching container:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        const data = await req.json;

        await connectToDB();

        const container = await Container.findById(id);
        if (!container) {
            return NextResponse.json({ message: 'Container not found' }, { status: 404 });
        }

        // update container
        const { name, currentWeight, maxWeight, minWeight, alertWeight, unit, isNew } = data;

        // only add to weight history if weight changed
        if (container.currentWeight !== currentWeight) {
            container.weightHistory.push({
                weight: currentWeight,
                date: new Date()
            });
        }

        container.name = name;
        container.currentWeight = currentWeight;
        container.maxWeight = maxWeight;
        container.minWeight = minWeight;
        container.alertWeight = alertWeight;
        container.unit = unit;
        container.isNew = isNew;

        await container.save();

        return NextResponse.json({ message: 'Container updated', container });
    } catch (error) {
        console.error('Error updating container', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        await connectToDB();

        const container = await Container.findByIdAndDelete(id);

        if (!container) {
            return NextResponse.json({ message: 'Container not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Container deleted successfully' });
    } catch (error) {
        console.error("Error deleting container:", error);
         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}