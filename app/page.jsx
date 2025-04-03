"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { AngryIcon as PantryIcon } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <PantryIcon className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-primary">SmartPantry</h1>
          </div>

          {/* Hero Section */}
          <div className="max-w-2xl text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Manage Your Household Pantry Smartly
            </h2>
            <p className="text-lg text-muted-foreground">
              Keep track of your pantry items, generate shopping lists, and
              coordinate with your household members - all in one place.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Link
              href="/register"
              className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-md hover:from-blue-600 hover:to-teal-600 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-100 transition-all"
            >
              Log In
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Smart Inventory</h3>
              <p className="text-muted-foreground">
                Keep track of your pantry items and never run out of essentials.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Shopping Lists</h3>
              <p className="text-muted-foreground">
                Generate smart shopping lists based on your inventory levels.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Household Sync</h3>
              <p className="text-muted-foreground">
                Coordinate with family members and keep everyone updated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
