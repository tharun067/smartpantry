import {  NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
                
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await req.json();

        if (userId !== session.user.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await connectToDB();
        await Notification.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );

        return NextResponse.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}