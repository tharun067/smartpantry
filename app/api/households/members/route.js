import { connectToDB } from "@/config/db";
import Household from "@/models/HouseHold";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectToDB();

    try {
        const { searchParams } = new URL(request.url);
        const householdId = searchParams.get('householdId');

        if (!householdId) {
            return NextResponse.json({ error: "Household Id is required" }, { status: 400 });
        }

        const household = await Household.findById(householdId).populate('members.profileId').exec();
        if (!household) {
            return NextResponse.json({ error: "Household not found" }, { status: 404 });
        }
        return NextResponse.json(household.members);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await connectToDB();

    try {
        const { householdId, name, email, phone, notificationType, contactInfo, password } = await request.json();

        if (!householdId || !name || !password) {
            return NextResponse.json({ error: "Household ID, name, and password are required" }, { status: 400 });
        }

        // Ensure unique email or phone
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return NextResponse.json({ error: "Email or phone already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in User table
        const newUser = await User.create({
            email,
            phone,
            password: hashedPassword,
            name,
            householdId,
            isPrimary: false
        });

        // Add to Household members
        const household = await Household.findByIdAndUpdate(
            householdId,
            {
                $push: {
                    members: {
                        profileId: newUser._id,
                        name,
                        notificationType,
                        contactInfo
                    }
                }
            },
            { new: true }
        ).populate("members.profileId");

        return NextResponse.json(household.members);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    await connectToDB();

    try {
        const { memberId } = await request.json();

        // Remove from Users collection
        await User.findByIdAndDelete(memberId);

        // Remove from Household members
        const household = await Household.findOneAndUpdate(
            { "members.profileId": memberId },
            {
                $pull: {
                    members: { profileId: memberId }
                }
            },
            { new: true }
        );

        if (!household) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function LOGIN(request) {
    await connectToDB();

    try {
        const { emailOrPhone, password } = await request.json();

        if (!emailOrPhone || !password) {
            return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign({ userId: user._id, householdId: user.householdId }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return NextResponse.json({ token, userId: user._id, householdId: user.householdId });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
