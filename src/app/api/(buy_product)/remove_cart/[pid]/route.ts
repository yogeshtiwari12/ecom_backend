import { getServerSession } from "next-auth";
import { ItemModel } from "../../../model/ItemModel";
import { ProductModel } from "../../../model/user_product";
import connectDb from "../../../route";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/options";

export async function POST(  request: Request,
  context: { params: Promise<{ pid: string }> }
) {
    try {
        await connectDb();
        const {pid} = await context.params;

        const isSessionActive = await getServerSession(authOptions);
        if (!isSessionActive) {
           throw new Error("Authentication required");
        }
        
const remove_update_data = await ProductModel.findByIdAndDelete(pid);
if (!remove_update_data) {
    throw new Error("Product not found");
}

   remove_update_data.save();

        return Response.json({
            message:"Product removed from cart successfully",
            success:true,
            status: 200
        });
    }



    catch (error) {
        console.error("Error updating product:", error);
        return Response.json(
            { message: "Failed to update product", error: (error as Error).message, success: false },
            { status: 500 }
        );
    }
}
