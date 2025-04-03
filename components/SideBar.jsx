"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {FiBell, FiHelpCircle, FiHome, FiSettings, FiShoppingCart, FiUsers} from 'react-icons/fi';
function SideBar() {
  const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { href: '/shopping-list', icon: FiShoppingCart, label: 'Shopping List' },
        { href: '/notifications', icon: FiBell, label: 'Notifications' },
        { href: '/householdMembers', icon: FiUsers, label: 'HouseHold' },
        { href: '/help', icon: FiHelpCircle, label: 'Help' },
        { href: '/settings', icon: FiSettings, label: 'Settings' },
    ];
  return (
    <div className="w-64 bg-white shadow-sm h-screen fixed">
            <div className="p-4">
                <nav className="mt-8">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 rounded-md ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <item.icon className="mr-3" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
  );
}

export default SideBar
