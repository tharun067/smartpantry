"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold flex items-center">
          <FiShoppingCart className="mr-2 text-emerald-600" />
          <h3 className="text-gray-700">SmartPantry</h3>
        </Link>

        {user && (
          <div className="flex items-center space-x-6">
            <p className="text-sm text-gray-600">
              Hello,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-semibold">
                {user.name}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FiLogOut className="mr-1" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
