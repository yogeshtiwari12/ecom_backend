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
           return Response.json({
             message: "Authentication required",
             success: false,
             status: 401,
           });
        }
        
console.log("Session User ID:", isSessionActive.user._id);
        const add_data_update = await ProductModel.findOne({ 
          _id: pid, 
          userid: isSessionActive.user._id 
        });
        console.log("Add Data Update:", add_data_update);
        if (!add_data_update) {
            return Response.json({
                message: "Product not found",
                success: false,
                status: 404
            });
        }

        add_data_update.user_cart_count = add_data_update.user_cart_count + 1;
        await add_data_update.save();

        return Response.json({
            message:"Product Quantity updated",
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
