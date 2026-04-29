import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
        session.user.username = (user as any).username;
      }
      return session;
    },
    async signIn({ user }) {
      // Auto-generate username from name/email on first sign-in
      if (!user.id) return true;
      const existing = await prisma.user.findUnique({ where: { id: user.id } });
      if (existing && !existing.username) {
        const base = (user.name ?? user.email?.split("@")[0] ?? "player")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 15);
        let username = base;
        let n = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${base}${n++}`;
        }
        await prisma.user.update({ where: { id: user.id }, data: { username } });
      }
      return true;
    },
  },
};

// Augment next-auth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      username?: string;
    };
  }
}
