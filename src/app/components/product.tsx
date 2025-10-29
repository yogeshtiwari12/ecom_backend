"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Package, ShoppingCart, Heart, Star, Eye, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addcart_data, getproduct_data } from "../redux/product";
import { AppDispatch } from '../redux/store';
import { toast } from "sonner";

function ProductPage() {
  const [data, setdata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  


  const addcart = async (productId: string) => {
    try {
      const resultAction = await dispatch(addcart_data(productId));
      console.log("Add to cart result:", resultAction.payload.success);
      if(resultAction.payload.success){
        toast.success(resultAction.payload.message);
    }
    else{
      toast.error(resultAction.payload.message);
    }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await dispatch(getproduct_data());
        const response = unwrapResult(result);
        // console.log("API response:", response.data._id);
        if (response.success && response.data) {
          setdata(response.data);
        } else {
          setError("API response doesn't contain data");
          console.error("API response doesn't contain data:", response);
        }
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (error) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-950/80 border-red-800 backdrop-blur-xl shadow-2xl">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            {error}. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-12  text-white pt-4 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className=" backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden animate-pulse">
                <div className="relative">
                  <Skeleton className="h-48 w-full bg-slate-700/50" />
                  <div className="absolute top-4 left-4">
                    <Skeleton className="h-6 w-16 bg-blue-600/50 rounded-full" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Skeleton className="h-6 w-8 bg-slate-600/50 rounded-full" />
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 bg-slate-700/50" />
                    <Skeleton className="h-3 w-12 bg-slate-700/50" />
                  </div>
                  <Skeleton className="h-4 w-3/4 bg-slate-700/50" />
                  <Skeleton className="h-6 w-20 bg-slate-700/50" />
                  <Skeleton className="h-3 w-full bg-slate-700/50" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-16 bg-slate-700/50 rounded-full" />
                    <Skeleton className="h-5 w-12 bg-slate-700/50 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-11 w-full bg-slate-700/50 rounded-xl" />
                    <Skeleton className="h-11 w-full bg-slate-700/50 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {data.map((product: any, index: number) => (
              <div 
                key={product._id || index} 
                className=" backdrop-blur-md  rounded-md border border-slate-700/50 hover:border-purple-500/50  duration-700 hover:shadow-md hover:shadow-purple-500/25 relative overflow-hidden transform hover:-translate-y-0 hover:scale-[1.02] max-w-sm mx-auto w-full"
              >
                <div className="relative  ">
                  <div className="h-40 relative overflow-hidden  ">
                    {product.imageUrl ? (
                      <img 
                        src={typeof product.imageUrl === 'string' ? product.imageUrl : product.imageUrl.url || 'https://via.placeholder.com/400'} 
                        alt={product.name || 'Product'} 
                        className="w-full h-44 object-cover transition-transform duration-500 filter brightness-80 group-hover:brightness-80 "
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-750 to-slate-700">
                        <Package className="text-slate-400 w-12 h-12 group-hover:text-slate-300 transition-colors" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md border border-red-400/30 animate-pulse">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-5 relative  ">
                  <div className="flex items-center justify-between mb-3 w-full">
                    {product.brand ? (
                      <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold bg-slate-800/30 px-2 py-1 rounded-md">
                        {product.brand}
                      </span>
                    ) : (
                      <div></div>
                    )}
                    {product.rating && (
                      <div className="flex items-center gap-1.5 bg-slate-800/30 px-2 py-1 rounded-md">
                        <div className="flex text-yellow-400 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-slate-600"}`}
                            />
                          ))}

                        </div>
                        <span className="text-xs text-slate-300 font-medium">({product.rating})</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <h3 className="text-gray-400 font-medium text-base leading-tight line-clamp-2 group-hover:text-purple-200 transition-colors flex-1">
                      {product.name || product.title || 'Premium Product'}
                    </h3>
                    <div className="flex flex-col items-end shrink-0">
                      {product.price && (
                        <span className="text-md font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 bg-clip-text text-transparent">
                          ${product.price}
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {product.description || 'Premium quality product with excellent features and modern design crafted for perfection.'}
                  </p>
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.features.slice(0, 2).map((feature: string, idx: number) => (
                          <span key={idx} className="text-xs bg-slate-800/50 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.color && (
                      <span className="text-xs bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/30 hover:bg-blue-500/25 transition-colors">
                        {product.color}
                      </span>
                    )}
                    {product.size && (
                      <span className="text-xs bg-purple-500/15 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30 hover:bg-purple-500/25 transition-colors">
                        {product.size}
                      </span>
                    )}
                    {product.freeShipping && (
                      <span className="text-xs bg-emerald-500/15 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors flex items-center gap-1">
                        🚚 Free Ship
                      </span>
                    )}
                  </div>
                  {product.estimatedDelivery && (
                    <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                      <Zap className="w-3 h-3" />
                      <span>{product.estimatedDelivery}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {product.stock === 0 ? (
                      <button 
                        className="w-full py-3 px-4 rounded-md font-semibold text-sm bg-slate-700/50 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 border border-slate-600/30"
                        disabled
                      >
                        <span>🔒</span> Sold Out
                      </button>
                    ) : (
                      <>
                        <button 
                          className="w-full py-3 px-4 rounded-md font-semibold text-sm transition-transform duration-600 transform hover:scale-x-105 bg-gray-200 hover:from-purple-500 hover:to-blue-500 text-black shadow-md flex items-center justify-center gap-2 border border-purple-500/30"
                          onClick={() => {addcart(product.id)} }
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button 
                          className="w-full py-3 px-4 rounded-md font-semibold text-sm transition-transform duration-600 transform hover:scale-x-105 bg-purple-700 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg flex items-center justify-center gap-2 border border-purple-500/30"
                        >
                          <Zap className="w-4 h-4" />
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                <Package className="w-16 h-16 text-slate-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl"></div>
            </div>
            <h3 className="text-3xl font-bold  mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              No products found
            </h3>
            <p className="text-slate-400 text-center max-w-md leading-relaxed">
              Our premium collection is being curated. Check back soon for extraordinary new arrivals that will exceed your expectations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
