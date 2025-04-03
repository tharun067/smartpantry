import { connectToDB } from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import Household from "@/models/HouseHold";

export async function POST(request) {
    await connectToDB();

    try {
        const { name, email, phone, password, householdName, isPrimary } = await request.json();

        if (!name || !email || !phone || !password || !householdName) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        //Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let householdId;
        if (isPrimary) {
            //Create new household
            const newHousehold = new Household({
                name: householdName,
                members: []
            });
            await newHousehold.save();
            householdId = newHousehold._id;
        }
        //Create user
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            householdId,
            isPrimary
        });
        await newUser.save();

        if (isPrimary) {
            //Add primary user as first member
            await Household.findByIdAndUpdate(householdId, {
                $push: {
                    members: {
                        profileId: User._id,
                        name: User.name,
                        notificationType: email ? 'email' : 'sms',
                        contactInfo: email || phone
                    }
                }
            });
        }

        return NextResponse.json({ message: "User created successfully." });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
    }
}