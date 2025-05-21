import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Household from "@/models/Household";
import Container from "@/models/Container";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
                
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDB();
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check id user is head of a household
        if (user.isHouseHed && user.householdId) {
            const household = await Household.findById(user.householdId);

            if (household) {
                // Check if there are other members in the housegold
                if (household.members.length > 1) {
                    return NextResponse.json({
                        message: 'You cannot delete your account while being the head of a household with members. Transfer ownership or remove all members first.'
                    }, { status: 400 });
                }

                // Delete the household
                await Household.findByIdAndDelete(user.householdId);

                // Delete all containers associated with the household
                await Container.deleteMany({ householdId: user.householdId });
            }
        } else if (user.householdId) {
            // If user is not head but part of a household, remove from members list
            await Household.updateOne(
                { _id: user.householdId },
                { $pull: { members: user._id } }
            );
        }

        // Delete all notification for this user
        await Notification.deleteMany({ userId: user._id });

        // Delete the user
        await User.findByIdAndDelete(session.user.id);

        return NextResponse.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('Error inviting user to household', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}