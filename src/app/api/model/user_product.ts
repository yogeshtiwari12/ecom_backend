import mongoose, { Document, Model } from "mongoose";
import { Schema } from "mongoose";

interface UserProduct extends Document {
  user: string;
  product_name: string;
  user_product_description: string;
  user_product_price: number;
  user_product_category: string;
  createdAt: Date;
  updatedAt: Date;
  user_product_item_id: string;
  user_cart_count?: number;
  userid?: string;
  iscancelled?: boolean;
  isdelivered?: boolean;
  isOrderConfirmbyUser?: boolean;
  cartItem?: boolean;
  productId: string;
  address: {
    type: string,
    default: null
  },
  product_delivery_status: {
    type: String;
    enum: ["pending", "shipped", "delivered"];
    default: "pending";
  },
}

const productSchema = new Schema<UserProduct>(
  {
    product_name: { type: String, required: true },
    user_product_description: { type: String, required: true },
    user_product_price: { type: Number, required: true },
    user_product_category: { type: String, required: true },

    user_cart_count: { type: Number, default: 1 },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
    },
    iscancelled: { type: Boolean, default: false },
    isdelivered: { type: Boolean, default: false },
    isOrderConfirmbyUser: { type: Boolean, default: false },
    cartItem: { type: Boolean, required: true, default: false },
    productId: { type: String, required: true },

    product_delivery_status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    address: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel =
  mongoose.models.UserProduct ||
  mongoose.model<UserProduct>("UserProduct", productSchema);
