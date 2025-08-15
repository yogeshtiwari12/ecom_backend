import { getServerSession } from "next-auth/next";
import { ProductModel } from "../../../model/user_product";
import { connect } from "http2";
import connectDb from "../../../route";
import { authOptions } from "../../../(auth)/auth/[...nextauth]/options";
import { ItemModel } from "@/app/api/model/ItemModel";
export async function POST(
  request: Request,
  context: { params: Promise<{ pid: string }> }
) {
  try {
    await connectDb();
    const { pid } = await context.params;

    const isSessionActive = await getServerSession(authOptions);
    if (!isSessionActive) {
      return Response.json({
        message: "Authentication required",
        success: false,
        status: 401,
      });
    }

    const item_data = await ItemModel.findOne({$and:[{_id: pid},{stock: {$gt: 5}}]});
    if (!item_data) {
      throw new Error("Product not found");
    }

    const isexistingProduct = await ProductModel.findOne({
      $and: [{ productId: pid }, { userid: isSessionActive.user._id }],
    });
    if( isexistingProduct) {
        return Response.json({
          message: "Product already in cart",
          success: false,
          status: 400,
        });
    }
      const updateitem_Data = new ProductModel({
        product_name: item_data.name,
        user_product_description: item_data.description,
        user_product_price: item_data.price,
        user_product_category: item_data.category,
        userid: isSessionActive.user._id,
        productId: pid,
        user_cart_count: 1,
        cartItem: true,
      });

      await updateitem_Data.save();


    //   item_data.stock -= 1;
    //   await item_data.save();


      return Response.json({
        message: "Product added to cart successfully",
        success: true,
        status: 200,
      });
    }

catch (error) {
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
