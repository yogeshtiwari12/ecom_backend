import { connectDb } from "../../route";
import { ItemModel } from "../../model/ItemModel";

import { NextResponse as Response } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDb();

    const { name, description, price, category, imageUrl, stock, reason } =
      await request.json();

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !imageUrl ||
      stock === undefined
    ) {
      return Response.json({
        success: false,
        message: "All fields are required",
      });
    }

    const isproductalreadyExists = await ItemModel.findOne({ name });
    if (isproductalreadyExists.item_id) {
      return Response.json({
        success: false,
        message: "Product already exists with this id",
      });
    }

    const Items = new ItemModel({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      reason,
    });
    await Items.save();

    return Response.json({
      success: true,
      message: "Product added successfully",
      Items
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to add product",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
