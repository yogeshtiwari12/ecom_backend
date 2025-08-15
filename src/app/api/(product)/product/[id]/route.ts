import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/options";
import { ItemModel } from "@/app/api/model/ItemModel";
import connectDb from "@/app/api/route";
import { getServerSession } from "next-auth/next";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return Response.json(
      {
        success: false,
        message: "Product ID is required",
      },
      { status: 400 }
    );
  }

  try {
    await connectDb();
    // const isSessionActive = await getServerSession(authOptions);

    // if (!isSessionActive) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Session not active. Please log in.",
    //     },
    //     { status: 401 }
    //   );
    // }

    const product = await ItemModel.findById(id);
    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
