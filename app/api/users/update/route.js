import { connectToDB } from '@/config/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function PUT(request) {
    await connectToDB()

    try {
        const { name, email, phone, notificationType } = await request.json()

        if (!name || !email) {
        return NextResponse.json(
            { error: 'Name and email are required' },
            { status: 400 }
        )
        }

        const user = await User.findByIdAndUpdate(
        request.user.id,
        { name, email, phone, notificationType },
        { new: true }
        ).select('-password')

        return NextResponse.json(user)
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
        )
    }
}