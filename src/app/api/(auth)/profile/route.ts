import { getAuthSession } from "@/lib/auth";
import connectDb from "../../route";
import { ProductModel } from "../../model/user_product";
import { User } from "../../model/userModel";

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
    const userprofile = await User.findById(session.user._id).select("-password -verifyCodeExpiry -role -otp  ");
    const user_shop_data = await ProductModel.find({ userid: session.user._id });
    return Response.json(
      {
        message: "Profile retrieved successfully",
        success: true,
        user: userprofile,
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
