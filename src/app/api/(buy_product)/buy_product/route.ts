import { getServerSession } from "next-auth/next";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { ProductModel } from "../../model/user_product";
import connectDb from "../../route";

export async function POST(request: Request) {
  try {
    await connectDb()
    const body = await request.json();
    const {
      product_name,
      user_product_description,
      user_product_price,
      user_product_category,
      user_product_item_id,
      user_cart_count,
    } = body;

     if (
      !product_name ||
      !user_product_description ||
      !user_product_price ||
      !user_product_category ||
      !user_cart_count
    ) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const iSsessionActive = await getServerSession(authOptions);
    if (!iSsessionActive) {
      return new Response(
        JSON.stringify({ error: `Server Session Error ${iSsessionActive}` }),
        { status: 401 }
      );
    } else {
      const userProduct = new ProductModel({
      
        product_name: product_name,
        user_product_description: user_product_description,
        user_product_price: user_product_price,
        user_product_category: user_product_category,
        user_cart_count: user_cart_count,
        userid: iSsessionActive?.user?._id, 
      });

      await userProduct.save();
    }
    return new Response(
      JSON.stringify({ message: "Product added successfully", product: body }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while processing your request: ${(error as Error).message}`,
      }),
      { status: 500 }
    );
  }
}
