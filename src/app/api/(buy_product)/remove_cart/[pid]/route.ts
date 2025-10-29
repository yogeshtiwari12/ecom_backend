import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectDb } from "../../../route";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/options";

export async function POST(
  request: Request,
  { params }: { params: { pid: string } }
) {
    try {
        await connectDb();
        const { pid } = params;
        console.log("Removing product with ID:", pid);

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({
                message: "Authentication required",
                success: false,
                status: 401
            });
        }
        
        // Try to delete the item using Prisma
        try {
            const remove_update_data = await prisma.userProduct.delete({
                where: {
                    id: pid
                }
            });
            
            console.log("Successfully removed product:", remove_update_data);
        } catch (err) {
            // If the product cannot be found by ID, log error
            console.error("Error deleting product:", err);
            throw new Error("Product not found or could not be deleted");
        }

        return NextResponse.json({
            message: "Product removed from cart successfully",
            success: true,
            status: 200
        });
    } catch (error) {
        console.error("Error removing product:", error);
        return NextResponse.json(
            { message: "Failed to remove product", error: (error as Error).message, success: false },
            { status: 500 }
        );
    }
}
