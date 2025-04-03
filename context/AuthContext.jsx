"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const handleAuthState = async () => {
            setLoading(true);
            try {
                if (session?.user) {
                    setUser(session.user);
                } else {
                    const userData = await fetch('/api/auth/me');
                    setUser(userData);
                }
            } catch (error) {
                console.log("Auth State error", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        handleAuthState();
    }, [session]);
    const register = async (userData) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            console.log("Registration response:", response);

            if (!response.ok) {
                console.log("Registration failed", response);
            }

            return response.json();
        } catch (error) {
            console.log("Registration Error", error.message);
        }
    }

    const login = async (credentials) => {
        try {
            //For Email/password login
            if (credentials.emailOrPhone && credentials.password) {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });
            
                //Authenticate With NextAuth
                await signIn('credentials', {
                    redirect: false,
                    ...credentials,
                    callbackUrl: '/dashboard'
                });
                setUser(response);
                router.push('/dashboard');
            }
        } catch (error) {
            console.log("Login Error", error.message);
        }
    }

    const logout = async () => {
        try {
            //clear data
            await signOut();
            await fetch('/api/auth/logout', { method: 'POST' });

            setUser(null);
            router.push('/login');
        } catch (error) {
            console.log("Logout Error", error.message);
        }
    }
    return (
        <AuthContext.Provider value={{
            user,
            loading,
            register,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);