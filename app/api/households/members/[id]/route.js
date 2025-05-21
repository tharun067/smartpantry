import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Household from "@/models/Household";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const memberId = params.id;

        // Verify user is the head of the household
        if (!session.user.isHouseHead) {
            return NextResponse.json({ message: 'Only the head of the household can remove members' }, { status: 403 });
        }

        await connectToDB();

        // Get the household
        const household = await Household.findById(session.user.householdId);

        if (!household) {
            return NextResponse.json({ message: 'Household not found' }, { status: 404 });
        }

        // Check if the member to remove exists in the household
        if (!household.members.includes(memberId)) {
            return NextResponse.json({ message: 'Member not found in household' }, { status: 404 });
        }

        // Remove member from household
        household.members = household.members.filter(
            member => member.toString() !== memberId
        );

        await household.save();

        // Update user's householdId to null
        await User.findByIdAndUpdate(memberId, { householdId: null });

        return NextResponse.json({ message: 'Member removed from household successfully' });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}