import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../(auth)/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
export async function POST(
  request: Request,
  context: { params: Promise<{ pid: string }> }
) {
  try {
    const { pid } = await context.params;

    const isSessionActive = await getServerSession(authOptions);
    if (!isSessionActive) {
      return Response.json({
        message: "Authentication required",
        success: false,
        status: 401,
      });
    }

    const item_data = await prisma.item.findFirst({
      where: {
        AND: [
          { id: pid },
          { stock: { gt: 0 } }
        ]
      }
    });

    if (!item_data) {
      throw new Error("Product not found");
    }
console.log("Item Data:", item_data)
    
    const uniqueItemId = `${item_data.id}-${isSessionActive.user.id}`;
    // console.log("Unique Item ID:", uniqueItemId)
    const isexistingProduct = await prisma.userProduct.findUnique({
      where: {
        user_product_item_id: uniqueItemId
      }
    });

    if (isexistingProduct) {
      return Response.json({
        message: "Product already in cart",
        success: false,
        status: 400,
      });
    }

    await prisma.userProduct.create({
      data: {
        product_name: item_data.name,
        user_product_description: item_data.description,
        user_product_price: item_data.price,
        user_product_category: item_data.category,
        userId: isSessionActive.user.id,
        productId: pid,
        user_product_cart_count: 1,
        cartItem: true,
        user_product_item_id: uniqueItemId,
      },
    });

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
