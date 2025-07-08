"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const BuyProductPage = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    user_product_description: "",
    user_product_price: "",
    user_product_category: "",
    user_cart_count: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/api/buy_product", formData);

      if (res.data.success) {
        toast.success("Purchase saved successfully!");
        setFormData({
          product_name: "",
          user_product_description: "",
          user_product_price: "",
          user_product_category: "",
          user_cart_count: 1,
        });
      } else {
        toast.error(res.data.message || "Failed to save purchase.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-5">
      <h2 className="text-2xl font-bold text-center">For Testing </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "product_name", placeholder: "Product Name" },
          { name: "user_product_description", placeholder: "Description" },
          { name: "user_product_price", placeholder: "Price" },
          { name: "user_product_category", placeholder: "Category" },
          { name: "user_cart_count", placeholder: "Quantity", type: "number" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={(formData as any)[field.name]}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Buy Now"}
        </button>
      </form>
    </div>
  );
};

export default BuyProductPage;
