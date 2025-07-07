

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
    
        const response = NextResponse.json(
            {
                message: "Logged out successfully",
                success: true
            },
            { status: 200 }
        );

        // Clear the necessary NextAuth cookies based on your JWT configuration
        response.cookies.set({
            name: "next-auth.session-token",
            value: "",
            expires: new Date(0),
            path: "/",
        });
        
        response.cookies.set({
            name: "next-auth.callback-url",
            value: "",
            expires: new Date(0),
            path: "/",
        });
        
        response.cookies.set({
            name: "next-auth.csrf-token",
            value: "",
            expires: new Date(0),
            path: "/",
        });

        return response;
    }
    catch (error) {
        console.error("Error logging out:", error);
        return Response.json({
            message: "Failed to log out",
            error: (error as Error).message,
            success: false
        }, { status: 500 });
    }
}