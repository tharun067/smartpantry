import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDB } from '@/config/db'
import User from '@/models/User'

export async function POST(request) {
  await connectToDB()

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new password are required' },
        { status: 400 }
      )
    }

    // Get user from session
    const user = await User.findById(request.user._id).select('+password')

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    user.password = hashedPassword
    await user.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}