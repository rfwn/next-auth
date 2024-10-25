import NextAuth, { type DefaultSession } from "next-auth"
import "next-auth/jwt"
import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getAccountByUserId } from "./data/account"

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      isOAuth: Boolean;
    } & DefaultSession["user"]
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user}) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id!);
    //   if(!existingUser || !existingUser.emailVerified) return false;
    //   return true;
    // },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub 
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if(session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})