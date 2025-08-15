import { ItemModel } from "@/app/api/model/ItemModel";
import { ProductModel } from "@/app/api/model/user_product";
import { connectDb } from "@/app/api/route";

export async function POST(
  request: Request,
  context: { params: Promise<{ pid: string }> }
) {
  try {
    await connectDb();

    const { pid } = await context.params;

    const data = await request.json();

    if (!pid) {
      return Response.json(
        { message: "Product ID is required", success: false },
        { status: 400 }
      );
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(pid, data, {
      new: true,
    });
    console.log("Updated Product:", updatedProduct, data);
    if (!updatedProduct) {
      return Response.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Product updated successfully",
        success: true,
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      {
        message: "Failed to update product",
        error: (error as Error).message,
        success: false,
      },
      { status: 500 }
    );
  }
}
