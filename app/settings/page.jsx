'use client'

import { useAuth } from '@/context/AuthContext'
import { signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { FiSave, FiEdit, FiUser, FiBell, FiLock } from 'react-icons/fi'

export default function SettingsPage() {
    const { user, logout } = useAuth()
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        notificationType: 'email'
    })
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        if (user) {
        setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            notificationType: user.notificationType || 'email'
        })
        setLoading(false)
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
        setLoading(true)
        await fetch('/api/users/update', {
            method: 'PUT',
            body: JSON.stringify(profile)
        })
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        setTimeout(() => setSuccess(null), 3000)
        } catch (error) {
        setError(error.message || 'Failed to update profile')
        } finally {
        setLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const currentPassword = formData.get('currentPassword')
        const newPassword = formData.get('newPassword')

        try {
        setLoading(true)
        await fetch('/api/users/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        })
        setSuccess('Password changed successfully!')
        e.currentTarget.reset()
        setTimeout(() => setSuccess(null), 3000)
        } catch (error) {
        setError(error.message || 'Failed to change password')
        } finally {
        setLoading(false)
        }
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };
    
    if (loading && !user) {
        return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                    {success}
                </div>
            )}

            <div className="space-y-8">
                {/* Profile Section */}
                <section className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium flex items-center">
                            <FiUser className="mr-2" /> Profile Information
                        </h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center text-indigo-600 hover:text-indigo-800 cursor-pointer"
                            >
                                <FiEdit className="mr-1" /> Edit
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                ) : (
                                    <p className="p-2 text-gray-900">{profile.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                ) : (
                                    <p className="p-2 text-gray-900">{profile.email || 'Not set'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="p-2 text-gray-900">{profile.phone || 'Not set'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preference</label>
                                {isEditing ? (
                                    <select
                                        name="notificationType"
                                        value={profile.notificationType}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                    </select>
                                ) : (
                                    <p className="p-2 text-gray-900 capitalize">{profile.notificationType}</p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                                >
                                    <FiSave className="mr-2" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </section>

                {/* Password Section */}
                <section className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium flex items-center mb-4">
                        <FiLock className="mr-2" /> Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    minLength="8"
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 cursor-pointer"
                                >
                                    <FiSave className="mr-2" />
                                    {loading ? 'Updating...' : 'Change Password'}
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                {/* Account Actions */}
                <section className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-red-700 mb-4">Account Actions</h2>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 cursor-pointer"
                    >
                        Sign Out
                    </button>
                </section>
            </div>
        </div>
    );
}