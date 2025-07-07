import { Interface } from "readline";

declare module "next-auth" {
  interface User {
    _id: string;
    isverified: boolean;
    name: string;
  }

  interface Session {
    user: {
      _id?: string;
      isverified: boolean;
      name: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    name: string;
  }
}




