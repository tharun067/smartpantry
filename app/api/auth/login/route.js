import { connectToDB } from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await connectToDB();

    try {
        const { emailOrPhone, password } = await request.json();
        //validate input 
        if (!emailOrPhone || !password) {
            return NextResponse({ error: 'Email/phone and password are required' }, { status: 400 });
        }

        //Find user by email or phone
        const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] }).select('+password');
        if (!user) {
            return NextResponse({ error: 'Invalid Credentials' }, { status: 404 });
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid Credentials'},{ status: 401 });
        }

        //Return user data (excluding password)
        const userData = user.toObject();
        delete userData.password;
        return NextResponse.json(userData);
    } catch (error) {
        console.log('Login Error', error.message);
        
    }
}