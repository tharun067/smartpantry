"use client"
import { useAuth } from '@/context/AuthContext';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        householdName: '',
        isPrimary: true,
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form:", formData);
        try {
            await register(formData);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message || "Registration failed")
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Create your SmartPantry</h2>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="householdName" className="block text-sm font-medium text-gray-700">
                                Household Name
                            </label>
                            <input
                                id="householdName"
                                name="householdName"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.householdName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="isPrimary"
                                name="isPrimary"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={formData.isPrimary}
                                onChange={handleChange}
                            />
                            <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700">
                                I'm the primary household member
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit" 
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
            <div className="hidden md:flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of households already using SmartPantry to manage their groceries efficiently.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Family Coordination</h3>
                <p className="text-sm text-muted-foreground">Keep everyone in sync with shared lists</p>
              </div>
            </div>
            {/* Add more feature highlights here */}
          </div>
        </div>
      </div>
    );
}

export default RegisterPage
