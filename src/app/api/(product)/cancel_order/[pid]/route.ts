import { ProductModel } from "@/app/api/model/user_product";
import connectDb from "@/app/api/route";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/options";

export async function POST(request:Request,
    context:{params:Promise<{pid:string}>}
){
    try{

        await connectDb();
        const {pid} = await context.params;

        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json(
                { message: "Authentication required", success: false },
                { status: 401 }
            );
        }

        const requestData = await ProductModel.findOneAndUpdate(
            { _id: pid, userid: session.user._id },
            { isOrderConfirmbyUser: false },
            { new: true }
        );
        
        if(!requestData){
            return Response.json(
                {message:"Order not found", success:false},
                {status:404}
            );
        }

        return Response.json(
            { message: "Order cancelled successfully", success: true },
            { status: 200 }
        );

    }
    catch(error){
        console.error("Error cancelling order:", error);
        return Response.json(
            { message: "Failed to cancel order", error: (error as Error).message, success: false },
            { status: 500 }
        );
    }
}