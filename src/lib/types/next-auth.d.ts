import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;   // 👈 add id
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;    // 👈 add id here too
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;    // 👈 add id in JWT as well
  }
}
