import {  NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
                
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const id = params.id;

        await connectToDB();
        const notification = await Notification.findById(id);
        if (!notification) {
            return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
        }

        // Ensure user can only mark their own notification as read
        if (notification.userId.toString() !== session.user.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        notification.read = true;
        await notification.save();
        return NextResponse.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}