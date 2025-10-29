import { prisma } from "@/lib/prisma";
import { ItemModel } from "../../model/ItemModel";
import connectDb from "../../route";

export async function GET() {
  try {

    const data = await prisma.item.findMany();
    if (!data) {
      return Response.json(
        { message: "No products found", success: false },
        { status: 404 }
      );
    }
    // console.log("Fetched products:", data);
    return Response.json(
      { message: "Products fetched successfully", success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching products:", error);
    return Response.json(
      {
        message: "Failed to fetch products", error: (error as Error).message,
      })
  }
};
