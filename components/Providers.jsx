"use client";
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

function Providers({ children }) {
    
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme='system'>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}

export default Providers
