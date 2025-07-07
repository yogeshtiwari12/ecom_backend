import { getServerSession } from "next-auth/next";
import { ProductModel } from "../../model/user_product";
import { connect } from "http2";
import connectDb from "../../route";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
export async function POST(request: Request) {
    try{
        await connectDb()
        const data  = await request.json();

        const iSsessionActive = await getServerSession(authOptions);
        if (!iSsessionActive) {
            return new Response(JSON.stringify({ error:"Server Session Error" }), { status: 401 });
        }
        const updateData =  await ProductModel.findOneAndUpdate({userid: iSsessionActive?.user?.id },data);

        updateData.user_cart_count = data.user_cart_count+1;
        await updateData.save();

        return Response.json({
            message:"Product added to cart successfully",
            success:true,
            status: 200
        })
    }



    catch (error) {
        console.error("Error updating product:", error);
        return Response.json(
            { message: "Failed to update product", error: (error as Error).message, success: false },
            { status: 500 }
        );
    }
}
