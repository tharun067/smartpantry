import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                emailOrPhone: { label: 'Email/Phone', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials),
                    });
                    const user = await res.json();

                    if (res.ok && user) {
                        return user;
                    }
                    return null;
                } catch (error) {
                    console.log("Authorization error:", error);
                    return null;
                }
            }
        })
    ],

    callbacks: {
        async jwt({token, user, account, profile, isNewUser}) {
            if (user) {
                token.user = user
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
})

export { handler as GET, handler as POST };