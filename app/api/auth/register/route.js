import {  NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Household from "@/models/Household";
import mongoose from "mongoose";
export async function POST(req) {
    try {
        const { name, email, phone, password, household, isHouseHead } = await req.json();
        // Validate inpute
         if (!name || !email || !phone || !password || !household ) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
         }
        
        await connectToDB();

        // check if user already exists
        const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserByEmail) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const existingUserByPhone = await User.findOne({ phone });
        if (existingUserByPhone) {
            return NextResponse.json({ message: 'User with this phone number already exists' }, { status: 409 });
        }

        // create user first (without household)
        const user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            password,
            isHouseHead,
        });
        await user.save();

        // create household if user is a house head
        if (isHouseHead) {
            const newHousehold = new Household({
                name: household,
                head: user._id,
                members: [user._id],
            });

            await newHousehold.save();

            // Update user with householdId
            user.householdId = newHousehold._id;
            await user.save();
        }
        
        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
