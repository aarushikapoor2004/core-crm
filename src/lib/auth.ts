import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db as prisma } from "@/db";
import { generateId } from "@/utils/generate-id";
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
              id: generateId(user.email),
              email: user.email,
              name: user.name ?? generateId(user.email),
              image: user.image
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    authorized: async ({ auth, request }) => {
      const { nextUrl } = request;

      const isProtected = PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route));
      if (isProtected && !auth?.user) return false;

      return true;
    },
  },
});
