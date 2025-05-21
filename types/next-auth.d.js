const authOptions = {
  // ... other NextAuth options
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
      session.user.id = token.id;
      session.user.householdId = token.householdId;
      session.user.isHouseHead = token.isHouseHead;
      return session;
    },
  },
  // ... other NextAuth options
};