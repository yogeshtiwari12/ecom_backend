import NextAuth from "next-auth";
import { authOptions } from "./options";

// Create the handler with proper typing for App Router
const handler = NextAuth(authOptions);

// Export the GET and POST handlers
export { handler as GET, handler as POST };