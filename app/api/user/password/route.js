import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
                
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
        }

        await connectToDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await User.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
        }

        // update password
        user.password = newPassword;
        await user.save();

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}