import { connectDb } from "../../../route";
import { ItemModel } from "../../../model/ItemModel";

export async function DELETE(request: Request,
  context: { params: Promise<{ pid: string }> }
) {
    try {
        await connectDb();
        
        const {pid} = await context.params;
        
        if (!pid) {
            return Response.json({
                message: "Product ID is required",
                success: false
            }, { status: 400 });
        }
          const deletedProduct = await ItemModel.findByIdAndDelete(pid, { lean: true });
     
        if (!deletedProduct) {
            return Response.json({
                message: "Product not found",
                success: false
            }, { status: 404 });
        }
        
        return Response.json({
            message: "Product deleted successfully",
            success: true,
            deletedProduct
        }, { status: 200 });
    } 
    catch (error) {
        console.error("Error deleting product:", error);
        
        return Response.json({
            message: "Failed to delete product",
            error: (error as Error).message,
            success: false
        }, { status: 500 });
    }   
}