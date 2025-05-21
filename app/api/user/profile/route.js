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
        const { name, email, phone } = await req.json();

        if (!name || !email || !phone) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        await connectToDB();

        // check if email is already taken by another user
        const existingUserWithEmail = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: session.user.id }
        });

        if (existingUserWithEmail) {
            return NextResponse.json({ message: 'email already in use' }, { status: 409 });
        }

        // check if pone is already taken by another user
        const existingUserWithPhone = await User.findOne({
            phone,
            _id: { $ne: session.user.id }
        });

        if (existingUserWithPhone) {
            return NextResponse.json({ message: 'Phone already in use' }, { status: 409 });
        }

        // Update user profile
        const updateUser = await User.findByIdAndUpdate(
            session.user.id,
            {
                name,
                email: email.toLowerCase(),
                phone,
            },
            { new: true }
        );

        if (!updateUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email
            }
        });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}