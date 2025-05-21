'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { LayoutDashboard, ShoppingCart, Bell, Users, HelpCircle, Settings } from "lucide-react";


function DashboardNav(){
    const pathname = usePathname();

    const items = [
        { title:'Dashboard',href:'/dashboard',icon:<LayoutDashboard className="w-4 h-4 mr-2"/>},
        { title:'Shopping List',href:'/dashboard/shopping-list',icon:<ShoppingCart className="w-4 h-4 mr-2"/>},
        { title:'Notifications',href:'/dashboard/notifications',icon:<Bell className="w-4 h-4 mr-2"/>},
        { title:'Household',href:'/dashboard/household',icon:<Users className="w-4 h-4 mr-2"/>},
        { title:'Help',href:'/dashboard/help',icon:<HelpCircle className="w-4 h-4 mr-2"/>},
        { title:'Settings',href:'/dashboard/settings',icon:<Settings className="w-4 h-4 mr-2"/>},
    ]

    return (
        <nav className="space-y-1">
            {items.map((item)=>(
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    buttonVariants({variant:'ghost'}),
                    pathname === item.href
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                'justify-start w-full mb-1'
                )}>
                    {item.icon}
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}

export default DashboardNav