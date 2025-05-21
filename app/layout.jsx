import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "SmartPantry - Kitchen Inventory Management",
  description: "Track your food containers, generate shopping lists, and manage your household inventory with SmartPantry",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right"/>
        </Providers>
      </body>
    </html>
  );
}
