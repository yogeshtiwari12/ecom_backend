
import { prisma } from "@/lib/prisma";
import { connectDb } from "../../route";

export async function POST(request: Request) {
  const { name, otp } = await request.json();

  try {
    await connectDb();

    const decodedusername = decodeURIComponent(name);

    const user = await prisma.user.findFirst({
      where:{name:decodedusername}
    }

    );

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.verifyCodeExpiry ? new Date(user.verifyCodeExpiry) > new Date() : false;


    if (isCodeValid && isNotExpired) {
      user.isVerified = true;

      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else if (!isNotExpired) {
      return Response.json({
        success: false,
        message: "Verification code expired",
      });
    } else {
      return Response.json({
        success: false,
        message: "Invalid verification code",
      });
    }
  } catch (error) {
    console.error("Error in verify code:", error);
    return Response.json({
      success: false,
      message: `Failed to verify code: ${(error as Error).message}`,
    });
  }
}

// GET function to check verification status or user session
export async function GET(request: Request) {
  try {
    // Get query parameters if any
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (email) {
      // Find user by email if provided
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (user) {
        return Response.json({
          success: true,
          verified: user.isVerified,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role
          }
        });
      } else {
        return Response.json({
          success: false,
          message: "User not found"
        }, { status: 404 });
      }
    } else {
      // Return all verified users (for admin purposes)
      const users = await prisma.user.findMany({
        where: { isVerified: true },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true
        }
      });
      
      return Response.json({
        success: true,
        users
      });
    }
  } catch (error) {
    console.error("Error in verify GET:", error);
    return Response.json({
      success: false,
      message: `Error fetching verification data: ${(error as Error).message}`
    }, { status: 500 });
  }
}