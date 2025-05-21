import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
          placeholder: "john@example.com or +1...",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          await connectToDB();

          // Check if identifier is email or phone
          const isEmail = credentials.identifier.includes("@");

          const query = isEmail
            ? { email: credentials.identifier.toLowerCase() }
            : { phone: credentials.identifier };

          const user = await User.findOne(query);

          if (!user) {
            return null;
          }

          const isValidPassword = await user.comparePassword(
            credentials.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            householdId: user.householdId ? user.householdId.toString() : null,
            isHouseHead: user.isHouseHead,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.householdId = user.householdId;
        token.isHouseHead = user.isHouseHead;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.householdId = token.householdId;
        session.user.isHouseHead = token.isHouseHead;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
