import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db as prisma } from "@/db";
import { PROTECTED_ROUTES } from "@/constants";




export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user }) {
      try {
        let existingUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!existingUser && user.email) {
          existingUser = await prisma.user.create({
            data: {
              email: user.email,
              imageUrl: user.image,
              name: user.name ?? generateId(user.email),
            },
          });
        }
        if (existingUser) {
          user.id = existingUser.id;
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
  },
});
