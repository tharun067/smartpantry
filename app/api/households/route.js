import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Household from "@/models/Household";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ message: 'Household name is required' }, { status: 400 });
        }
        await connectToDB();

        // Check if user already has a household
        const user = await User.findById(session.user.id);
        if (user.householdId) {
            return NextResponse.json({ message: 'User already has a household' }, { status: 400 });
        }

        // Crate new household
        const household = new Household({
            name,
            head: user._id,
            members: [user._id],
        });

        await household.save();

        // Update user with household Id and make them the head
        user.householdId = household._id;
        user.isHouseHead = true;
        await user.save();

        return NextResponse.json({ message: 'Household created successfully', household }, { status: 201 });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}