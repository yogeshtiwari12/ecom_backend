import { connectDb } from "../../route";
import { ItemModel } from "../../model/ItemModel";
import { NextResponse as Response } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    await connectDb();
    
    const { name, description, price, category, imageUrl, stock, reason } = await request.json();

    if (!name || !description || !price || !category || !imageUrl || !stock) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const existingProduct = await ItemModel.findOne({ name });
    if (existingProduct) {
      return Response.json({ success: false, message: "Product already exists" }, { status: 409 });
    }

    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: 'products'
    });

    const newProduct = new ItemModel({
      name,
      description,
      price,
      category,
      imageUrl: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      stock,
      reason
    });

    await newProduct.save();

    return Response.json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    }, { status: 201 });

  } catch (error) {
    console.error("Error:", error);
    return Response.json({
      success: false,
      message: "Failed to add product"
    }, { status: 500 });
  }
}