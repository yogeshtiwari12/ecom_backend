import mongoose, { Document, Model } from "mongoose";
import { Schema } from "mongoose";

interface UserProduct extends Document {
  user: string;
  product_name: string;
  user_product_description: string;
  user_product_price: number;
  user_product_category: string;
  user_product_imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  user_product_item_id: string;
  user_cart_count?: number; // Optional field for cart count
  userid?: string; // Optional field for user ID

  iscancelled?: boolean; // Optional field to indicate if the product is cancelled
  isdelivered?: boolean; // Optional field to indicate if the product is delivered
}

const productSchema = new Schema<UserProduct>(
  {
    product_name: { type: String, required: true },
    user_product_description: { type: String, required: true },
    user_product_price: { type: Number, required: true },
    user_product_category: { type: String, required: true },
    user_product_imageUrl: { type: String },
    user_cart_count: { type: Number, default: 1 },
    userid:{ type: String, required: true }, // Assuming user ID is required
    iscancelled: { type: Boolean, default: false },
    isdelivered: { type: Boolean, default: false },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt automatically
  }
);

// Create and export the model

export const ProductModel = mongoose.models.UserProduct ||mongoose.model<UserProduct>("UserProduct", productSchema);
