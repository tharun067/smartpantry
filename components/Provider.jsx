"use client";
import AuthProvider from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";


function Provider({children,session}) {
    return (
        <SessionProvider session={session}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </SessionProvider>
    );
}

export default Provider
