import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Container from '@/models/Container';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' },{ status: 401 });
        }

        const id = params.id;
        const { weight } = await req.json();

        if (weight === undefined) {
            return NextResponse.json({ message: 'Weight is required' },{ status: 400 });
        }

        await connectToDB();

        const container = await Container.findById(id);

        if (!container) {
            return NextResponse.json({ message: 'Container not found' },{ status: 404 });
        }

        // update current weight
        container.currentWeight = weight;

        // add to weight history
        container.weightHistory.push({
            weight,
            date: new Date()
        });

        await container.save();

        // check if weight is below alert threshold and create notification
        if (weight <= container.alertWeight) {
            const notification = new Notification({
                userId: session.user.id,
                containerId: container._id,
                message: `${container.name} is running low (${weight} ${container.unit})`,
            });
            await notification.save();
        }

        return NextResponse.json({ message: 'Weight updated successfully',container });
    } catch (error) {
        console.error('Error updating weight:', error);
        return NextResponse.json({ message: 'Internal server error' },{ status: 500 });
    }
}