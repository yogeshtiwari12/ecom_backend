import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request) {
    try {

        const session = await getAuthSession();

        if (!session) {
            return Response.json(
                { message: "Session Error", success: false },
                { status: 401 }
            );
        }
        const userprofile = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isVerified: true,
                phone: true,
                employeeId: true,
                verifyCodeExpiry: true

            }
        });
        const user_shop_data = await prisma.userProduct.findMany({
            where: { userId: session.user.id },
        });
        // role:userprofile.role 
        return Response.json(
            {
                message: "Profile retrieved successfully",
                success: true,
                user: userprofile,
                user_shop_data: user_shop_data,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                message: "Failed to retrieve profile",
                error: (error as Error).message,
                success: false,
            },
            { status: 500 }
        );
    }
}