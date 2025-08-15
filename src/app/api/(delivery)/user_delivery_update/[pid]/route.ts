import { ProductModel } from "@/app/api/model/user_product";
import connectDb from "@/app/api/route";


export async function POST(request:Request,
  context: { params: Promise<{ pid: string }> }){

    try {
    await connectDb();
   const {pid} = await context.params;
   const data  = await request.json();
   console.log(data);


   const updatedata = await ProductModel.findByIdAndUpdate(pid,data,{new:true});
    if(!updatedata){
        return Response.json({
            message: "Update failed",
            status: 500,
            success: false,
            error: "Product not found"
        });
    }

    return Response.json({
        message: "Product updated successfully",
        status: 200,
        success: true,
    });

    } catch (error) {
        console.error("Error updating product:", error);
        return Response.json({
            message: "Update failed",
            status: 500,
            success: false,
            error: "Internal Server Error"
        });
    }
}