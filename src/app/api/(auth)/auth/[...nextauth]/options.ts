import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDb } from "@/app/api/route";
import { User } from "@/app/api/model/userModel";



export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any):Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        
        try {
          await connectDb();
          
          const user = await User.findOne({
            $or: [{ email: credentials.email }, { name: credentials?.name }],
            isVerified: true,
          });
          console.log(user);
          
          if (!user) {
            throw new Error("User not found ");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }

          return user;

        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || (() => {
    throw new Error("NEXTAUTH_SECRET is not set in environment variables");
  })(),
};