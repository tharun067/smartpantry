import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Household from "@/models/Household";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { email, householdId } = await req.json();
        if (!email || !householdId) {
            return NextResponse.json({ message: 'Email and household ID are required' },{ status: 400 });
        }

        // Verify user is the head of the household
        if (!session.user.isHouseHead || session.user.householdId !== householdId) {
            return NextResponse.json({ message: 'Only the head od household can send invites' }, { status: 403 });
        }

        await connectToDB();

        // Find the user to invite
        const userToInvite = await User.findOne({ email: email.toLowerCase() });
        if (!userToInvite) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if user already has a household
        if (userToInvite.householdId) {
            return NextResponse.json({ message: 'User already belongs to a household' }, { status: 400 });
        }

        // Get the household

        const household = await Household.findById(householdId);
        if (!household) {
            return NextResponse.json({ message: 'household not found' }, { status: 404 });
        }

        // Add user to household
        userToInvite.householdId = householdId;
        await userToInvite.save();

        // Add user to household members
        if (!household.members.includes(userToInvite._id)) {
            household.members.push(userToInvite._id);
            await household.save();
        }

        return NextResponse.json({ message: 'User add to household successfully' });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({message:'Internal server error'},{status:500})
    }
}