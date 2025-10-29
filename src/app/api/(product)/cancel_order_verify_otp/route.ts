import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import connectDb from "../../route";
import { ProductModel } from "../../model/user_product";
import { prisma } from "@/lib/prisma";



export async function POST(request: Request) {
    try {
        await connectDb();

        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                message: "Session Not Found",
                success: false
            }, { status: 401 });
        }

        const { cancel_order_otp } = await request.json();

        const verifyOtp = await prisma.userProduct.findFirst({
            where: { cancel_order_otp: cancel_order_otp } as any
        });
        if (!verifyOtp) {
            return Response.json({
                message: "Invalid OTP",
                success: false
            }, { status: 400 });
        }

        await prisma.userProduct.update({
            where: { id: verifyOtp.id },
            data: { 
                isorderConfirmbyUser: false,
                iscancelled: true,
                product_delivery_status: "cancelled"
            } as any
        });
        return Response.json({
            message: "Product Cancelled Successfully",
            success: true,
            verifyOtp
        }, { status: 200 });

    } catch (error) {
        console.error("Error verifying cancel order OTP:", error);
        return Response.json({
            message: "Failed to verify OTP",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}