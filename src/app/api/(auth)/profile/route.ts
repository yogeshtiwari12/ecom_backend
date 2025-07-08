import { getAuthSession } from "@/lib/auth";
import connectDb from "../../route";
import { ProductModel } from "../../model/user_product";

export async function GET(request: Request) {
  try {
    await connectDb();

    const session = await getAuthSession();

    if (!session || !session.user) {
      return Response.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const user_shop_data = await ProductModel.find(session.user.id)

    console.log("User profile data:", user_shop_data,session.user);
    return Response.json(
      {
        message: "Profile retrieved successfully",
        success: true,
        user: session.user,
        user_shop_data: user_shop_data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to retrieve profile",
        error: (error as Error).message,
        success: false,
      },
      { status: 500 }
    );
  }
}
