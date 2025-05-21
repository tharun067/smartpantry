import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Household from "@/models/Household";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        // verify user is a member of the household
        if (session.user.householdId !== id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await connectToDB();
        const household = await Household.findById(id);

        if (!household) {
            return NextResponse.json({ message: 'Household not found' }, { status: 404 });
        }

        // Get household members
        const members = await User.find(
            { _id: { $in: household.members } },
            { password: 0 }
        );

        return NextResponse.json({ household, members });
    } catch (error) {
        console.error("Error fetching household:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}