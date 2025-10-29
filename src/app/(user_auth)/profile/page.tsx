"use client";
import React, { useState, useEffect, useMemo, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  ShoppingBag,
  Package,
  Clock,
  DollarSign,
  LogOut,
  Bell,
  TrendingUp,
  Shield,
  Mail,
  Phone,
  Search,
  Filter,
  Calendar,
  Truck,
  CheckCircle,
  X,
  MapPin,
} from "lucide-react";
import axios from "axios";
import { cancel_order, increase_cart_count, removecart_data, update_address } from "@/app/redux/product";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { toast } from "sonner";
import { itemSchema } from "@/app/api/model/ItemModel";


const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [editingAddressOrderId, setEditingAddressOrderId] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState("");

  const removecart = async (productId: string) => {

    setRemovingItems(prev => new Set(prev).add(productId));
    console.log("items ", removingItems)

    try {
      // Update local state optimistically
      setProfileData((prevData: any) => {
        if (!prevData?.user_shop_data) return prevData;

        return {
          ...prevData,
          user_shop_data: prevData.user_shop_data.filter((item: any) => item.id !== productId || item._id !== productId)
        };
      });
      console.log("Product ID to remove:", productId)

      const result = await dispatch(removecart_data(productId));
      console.log("Product removed with ID:", productId)

      if (result.payload.success) {
        toast.success(result.payload.message);
      } else {
        toast.error(result.payload.message);
        await fetchProfile();
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Failed to remove product. Please try again.");

      await fetchProfile();
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;

      });
    }
  };

  const increaseCartCount = async (productId: string) => {
    try {
      console.log("Increasing quantity for product ID:", productId);

      const onsuccess = await dispatch(increase_cart_count(productId));
      if (onsuccess.payload.success) {
        toast.success(onsuccess.payload.message);
        await fetchProfile();
      } else {
        toast.error(onsuccess.payload.message);
      }
    }
    catch (error) {
      console.error("Error increasing cart count:", error);
      toast.error("Failed to increase cart count. Please try again.");
    }

  }

  const { confirmedOrders, totalItems, totalRevenue } = useMemo(() => {
    if (!profileData?.user_shop_data) {
      return {
        confirmedOrders: [],
        totalItems: 0,
        totalRevenue: 0,
      };
    }

    const orders =
      profileData.user_shop_data.filter(
        (item: any) => item?.isOrderConfirmbyUser === true
      ) || [];

    const items = orders.reduce(
      (acc: number, item: any) => acc + (item.user_cart_count || 0),
      0
    );

    const revenue = orders.reduce(
      (acc: number, item: any) =>
        acc + (item.user_product_price || 0) * (item.user_cart_count || 0),
      0
    );

    return {
      confirmedOrders: orders,
      totalItems: items,
      totalRevenue: revenue,
    };
  }, [profileData]);

  const filteredOrders = useMemo(() => {
    let filtered = confirmedOrders.filter((order: any) => {
      const matchesSearch =
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_product_category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "pending")
        matchesStatus = !order.isshipped && !order.isdelivered;
      else if (statusFilter === "shipped")
        matchesStatus = order.isshipped && !order.isdelivered;
      else if (statusFilter === "delivered") matchesStatus = order.isdelivered;

      return matchesSearch && matchesStatus;
    });


    return filtered;
  }, [confirmedOrders, searchTerm, statusFilter, sortBy]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/profile", {
        withCredentials: true,
      });
      console.log(response.data)

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Response data:", response.data);

      if (response.data.success) {
        setProfileData(response.data);
        setLoading(false);
      } else {
        console.error("API returned error:", response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



  const sidebarItems = [
    {
      id: "profile",
      label: "Profile Overview",
      icon: User,
      description: "Personal information & account details",
    },
    {
      id: "products",
      label: "Carts",
      icon: ShoppingBag,
      description: "Manage your inventory",
    },
    {
      id: "analytics",
      label: "Orders",
      icon: TrendingUp,
      description: "Performance & statistics",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Updates & alerts",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-purple-400 text-xl font-medium">
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl font-semibold mb-2">
            Unable to Load Profile
          </div>
          <p className="text-slate-400">
            Please check your connection and try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-600/30 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderUserProfile = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border border-purple-700/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl">
          <div className="p-6 pb-4">
            <h2 className="text-2xl text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text flex items-center gap-3 font-bold">
              <div className="p-2 bg-purple-600/20 rounded-xl">
                <User className="h-6 w-6 text-purple-400" />
              </div>
              Account Information
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <User className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-400 block mb-1">
                      Full Name
                    </label>
                    <p className="text-lg text-slate-200 capitalize font-semibold">
                      {profileData.user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-400 block mb-1">
                      Email Address
                    </label>
                    <p className="text-lg text-slate-200">
                      {profileData.user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-400 block mb-1">
                      Phone Number
                    </label>
                    <p
                      className={`text-lg font-medium ${profileData.user.phoneno
                          ? "text-slate-200"
                          : "text-amber-400"
                        }`}
                    >
                      {profileData.user.phoneno || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-400 block mb-1">
                      Account Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${profileData.user.isVerified
                            ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50"
                            : "bg-amber-600/20 text-amber-400 border-amber-500/50"
                          }`}
                      >
                        {profileData.user.isVerified
                          ? "✓ Verified Account"
                          : "⚠ Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCarts = () => (
    <div className="space-y-6">
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {profileData.user_shop_data &&
          profileData.user_shop_data.map((product: any) => {
            // More accurate color combos for delivery status
            let statusColor = "text-slate-400";
            let statusBg = "bg-slate-800/50";
            let statusLabel = product.product_delivery_status || "Unknown";
            const status = statusLabel.toLowerCase();

            if (status === "delivered") {
              statusColor = "text-green-600";
              statusBg = "bg-green-100/10 border-green-400/40";
              statusLabel = "Delivered";
            } else if (status === "shipped") {
              statusColor = "text-yellow-500";
              statusBg = "bg-yellow-100/10 border-yellow-400/40";
              statusLabel = "Shipped";
            } else if (status === "pending") {
              statusColor = "text-blue-500";
              statusBg = "bg-blue-100/10 border-blue-400/40";
              statusLabel = "Pending";
            } else if (status === "cancelled" || status === "canceled") {
              statusColor = "text-red-500";
              statusBg = "bg-red-100/10 border-red-400/40";
              statusLabel = "Cancelled";
            }

            return (
              <div
                key={product.id || product._id}
                className={`flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border border-purple-700/50 rounded-2xl shadow-2xl overflow-hidden hover:shadow-purple-500/10 transition-all duration-300 ${removingItems.has(product.id || product._id) ? 'opacity-50 scale-95 pointer-events-none' : ''}`}
              >
                <div className="flex-1 flex flex-col h-full">
                  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl flex-1 flex flex-col">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 text-sm border border-slate-700 rounded-xl flex items-center justify-center text-white font-bold">
                            {product.product_name?.charAt(0).toUpperCase() || "P"}
                          </div>
                          <div>
                            <h3 className="text-md font-bold text-slate-200 capitalize">
                              {product.product_name}
                            </h3>
                            <span className="inline-block bg-purple-600/20 text-purple-400 border border-purple-500/50 capitalize mt-1 px-2 py-1 rounded-full text-xs">
                              {product.user_product_category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-500">
                            ₹{product.user_product_price}
                          </p>
                          <p className="text-sm text-slate-400">per unit</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center gap-3">
                          <Package className="h-5 w-5 text-purple-400" />
                          <div>
                            <p className="text-xs text-slate-400">Quantity</p>
                            <p className="text-base font-semibold text-slate-200">
                              {product.user_product_cart_count} items
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-emerald-400" />
                          <div>
                            <p className="text-xs text-slate-400">Total Value</p>
                            {(() => {
                          const price = Number(product.user_product_price);
                          const qty = Number(product.user_product_cart_count);
                          const total = price * qty;
                          return Number.isFinite(total) ? (
                            <p className="text-base font-semibold text-emerald-400">
                            ₹{total.toLocaleString()}
                            </p>
                          ) : (
                            <p className="text-base font-semibold text-red-400">
                            NaN
                            </p>
                          );
                          })()}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center gap-3">
                          <Clock className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Created</p>
                            <p className="text-xs font-medium text-slate-200">
                              {formatDate(product.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className={`rounded-xl p-3 flex items-center gap-3 border ${statusBg}`}>
                          <Truck className={`h-5 w-5 ${statusColor}`} />
                          <div>
                            <p className="text-xs text-slate-400">Delivery Status</p>
                            <span className={`text-base font-semibold px-3 py-1 rounded-full ${statusColor} ${statusBg}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 bg-purple-700/80  hover:bg-purple-700 transition-all duration-200"
                          onClick={() => removecart(product.id || product._id)}
                          disabled={removingItems.has(product.id || product._id)}
                        >
                          {removingItems.has(product.id || product._id) ? "Removing..." : "Remove"}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 bg-slate-600/80 text-slate-200 hover:bg-slate-600 transition-all duration-200"
                          onClick={() =>
                            increaseCartCount(product.id || product._id)
                          }
                        >
                          Add More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  const orders = () => {
    const formatDate = (dateString: any) => {
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "Invalid Date";
      }
    };

    const getOrderStatus = (order: any) => {
      if (order.isdelivered)
        return {
          status: "delivered",
          color: "text-green-400",
          icon: CheckCircle,
        };
      if (order.isshipped)
        return { status: "shipped", color: "text-amber-400", icon: Truck };
      return { status: "pending", color: "text-blue-400", icon: Clock };
    };

    const handleRemoveOrder = async (orderId: any) => {
      try {

        if (window.confirm("Are you sure you want to remove this order?")) {
          const responseData = await dispatch(cancel_order(orderId));
          if (responseData.payload.success) {
            toast.success(responseData.payload.message);
          }
          else {
            toast.error(responseData.payload.message);
          }
        }
      } catch (error) {
        toast.error("Failed to remove order");
      }
    };

    const handleUpdateAddress = (orderId: string, deliveryAddress?: string) => {
      setEditingAddressOrderId(orderId);
      setAddressInput(deliveryAddress || "");
    };

    const handleAddressSubmit = async (orderId: string) => {

      const data = await dispatch(update_address({ orderId, address: addressInput }));

      if (data.payload.success) {
        toast.success(data.payload.message);
      }
      else {
        toast.error(data.payload.message);
      }
      setEditingAddressOrderId(null);
      setAddressInput("");
    };

    const clearFilters = () => {
      setSearchTerm("");
      setStatusFilter("all");
      setSortBy("newest");
    };

    return (
      <div className="space-y-6">
        {confirmedOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmedOrders.map((product: any) => {
              const orderStatus = getOrderStatus(product);
              const StatusIcon = orderStatus.icon;

              return (
                <div
                  key={product._id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border border-purple-700/50 rounded-2xl shadow-2xl overflow-hidden hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-purple-500/50 rounded-xl flex items-center justify-center text-blue-400 font-bold text-sm">
                          {product.product_name?.charAt(0).toUpperCase() || "O"}
                        </div>
                        <div>
                          <h4 className="text-md font-bold text-slate-200 capitalize truncate">
                            {product.product_name}
                          </h4>
                          <span className="inline-block text-gray-400 border border-purple-500/50 capitalize mt-1 px-2 py-1 rounded-full text-xs">
                            {product.user_product_category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-500">
                          ₹{product.user_product_price}
                        </p>
                        <p className="text-xs text-slate-400">per unit</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <StatusIcon className={`h-4 w-4 ${orderStatus.color}`} />
                      <span
                        className={`text-sm font-medium capitalize ${orderStatus.color}`}
                      >
                        {orderStatus.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="h-4 w-4 text-blue-400" />
                          <span className="text-xs text-slate-400">
                            Quantity
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-200">
                          {product.user_cart_count} items
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-blue-400" />
                          <span className="text-xs text-slate-400">
                            Order Total
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-emerald-500">
                          ₹
                          {(
                            product.user_product_price * product.user_cart_count
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            Order Date
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-200">
                          {formatDate(product.createdAt)}
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-3 border border-green-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            Delivery Address
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-200">
                          {product.address || "Address not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="relative py-4">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 transform -translate-y-1/2"></div>
                        <div
                          className={`absolute top-1/2 left-0 h-0.5 transform -translate-y-1/2 transition-all duration-500 ${product.isdelivered
                              ? "bg-green-500 w-full"
                              : product.isshipped
                                ? "bg-amber-500 w-2/3"
                                : "bg-blue-500 w-1/3"
                            }`}
                        ></div>

                        <div className="flex items-center justify-between relative">
                          <div className="relative flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-800 z-10"></div>
                            <span className="text-xs text-blue-400 mt-2 absolute top-full whitespace-nowrap">
                              Ordered
                            </span>
                          </div>

                          <div className="relative flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full border-2 border-slate-800 z-10 transition-colors duration-300 ${product.isshipped
                                  ? "bg-amber-500"
                                  : "bg-slate-600"
                                }`}
                            ></div>
                            <span
                              className={`text-xs mt-2 absolute top-full whitespace-nowrap transition-colors duration-300 ${product.isshipped
                                  ? "text-amber-400"
                                  : "text-slate-500"
                                }`}
                            >
                              Shipped
                            </span>
                          </div>

                          <div className="relative flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full border-2 border-slate-800 z-10 transition-colors duration-300 ${product.isdelivered
                                  ? "bg-green-500"
                                  : "bg-slate-600"
                                }`}
                            ></div>
                            <span
                              className={`text-xs mt-2 absolute top-full whitespace-nowrap transition-colors duration-300 ${product.isdelivered
                                  ? "text-green-400"
                                  : "text-slate-500"
                                }`}
                            >
                              Delivered
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Input Section - Centered */}
                    {editingAddressOrderId === product._id && (
                      <div className="mb-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-700/30">
                          <div className="flex items-center gap-2 mb-3 justify-center">
                            <MapPin className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-slate-300 font-medium">
                              Update Delivery Address
                            </span>
                          </div>
                          <div className="space-y-3">
                            <textarea
                              value={addressInput}
                              onChange={e => setAddressInput(e.target.value)}
                              placeholder="Enter complete delivery address with pincode "
                              rows={3}
                              className="w-full p-3 rounded-lg bg-slate-700/50 border border-purple-500/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                            />
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 transition-all duration-200"
                                onClick={() => handleAddressSubmit(product._id)}
                              >
                                Save Address
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-slate-600 hover:bg-slate-700 text-slate-200 px-4 py-2 transition-all duration-200"
                                onClick={() => setEditingAddressOrderId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-purple-700/80 hover:bg-purple-700 transition-all duration-200"
                        onClick={() => handleRemoveOrder(product._id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 bg-slate-600/80 text-slate-200 hover:bg-slate-600 transition-all duration-200"
                        onClick={() => handleUpdateAddress(product._id, product.deliveryAddress)}
                      >
                        Update Address
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-400 text-lg">No confirmed orders yet.</p>
            <p className="text-slate-500 text-sm mt-2">
              Orders will appear here once confirmed by users.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderComingSoon = (title: any, description: any) => (
    <div className="space-y-6">
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bell className="h-12 w-12 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          {title}
        </h2>
        <p className="text-slate-300 text-lg mb-8">{description}</p>
        <div className="inline-flex items-center gap-2 bg-purple-600/20 text-purple-400 px-6 py-3 rounded-full border border-purple-500/50">
          <Clock className="h-4 w-4" />
          Coming Soon
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderUserProfile();
      case "products":
        return renderCarts();
      case "analytics":
        return orders();
      case "notifications":
        return renderComingSoon(
          "Notifications Center",
          "Stay updated with real-time alerts and updates"
        );
      default:
        return renderUserProfile();
    }
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-900 via-black to-slate-900 flex">
      <div className="w-80 bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-r border-purple-700/50 fixed h-full">
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-12 h-12 border border-purple-800 rounded-full flex items-center justify-center text-white text-md font-bold shadow-lg">
                  {profileData.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-200 capitalize mb-1">
                  {profileData.user.name}
                </h3>
                <p className="text-sm text-slate-400 truncate">
                  {profileData.user.email}
                </p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>

          <nav className="space-y-3 flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Dashboard
            </p>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`w-full border border-slate-700/50 justify-start gap-4 h-auto p-4 text-left transition-all duration-200 rounded-lg ${activeTab === item.id
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border-purple-500/50 shadow-lg"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-purple-400 hover:translate-x-1"
                    }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="flex items-start gap-4">
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-700/50">
            <button className="w-full justify-start gap-4 h-12 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 flex items-center px-4 rounded-lg">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-80 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;