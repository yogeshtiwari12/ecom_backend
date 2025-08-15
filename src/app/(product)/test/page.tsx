"use client";

import { use, useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  User,
  Phone,
  Star,
  Navigation,
  Timer,
  X,
  AlertCircle,
  MessageCircle,
  Wallet,
  History,
  LogOut,
  Search,
  DollarSign,
  Target,
  Edit3,
  Users,
  ShoppingBag,
  Download,
  Copy,
  Eye,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { users_with_prod_details } from "@/app/redux/product";
import { toast } from "sonner";
import { set } from "mongoose";

export default function EnhancedDeliveryDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [cancelOtp, setCancelOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<
    string | null
  >(null);
  const dispatch = useDispatch<AppDispatch>();

  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "Alex Johnson",
      phone: "+1 555-0123",
      address: "123 Main St, NYC",
      status: "in_transit",
      items: 2,
      eta: "15 mins",
      distance: "2.3 km",
      rating: 4.8,
      amount: 450,
      paymentMethod: "Card",
      notes: "Ring doorbell twice",
      priority: "high",
      orderTime: "2 hours ago",
      estimatedDelivery: "2:30 PM",
    },
    {
      id: "ORD-002",
      customer: "Sarah Chen",
      phone: "+1 555-0456",
      address: "456 Oak Ave, NYC",
      status: "pending",
      items: 1,
      eta: "25 mins",
      distance: "4.1 km",
      rating: 4.9,
      amount: 320,
      paymentMethod: "Cash",
      notes: "Leave at door",
      priority: "medium",
      orderTime: "45 mins ago",
      estimatedDelivery: "3:00 PM",
    },
    {
      id: "ORD-003",
      customer: "Alex Johnson",
      phone: "+1 555-0123",
      address: "789 Pine St, NYC",
      status: "delivered",
      items: 3,
      eta: "Delivered",
      distance: "1.8 km",
      rating: 5.0,
      amount: 680,
      paymentMethod: "UPI",
      notes: "",
      priority: "low",
      orderTime: "3 hours ago",
      estimatedDelivery: "Delivered at 1:45 PM",
    },
    {
      id: "ORD-004",
      customer: "Emma Davis",
      phone: "+1 555-0987",
      address: "321 Elm St, NYC",
      status: "cancelled",
      items: 2,
      eta: "Cancelled",
      distance: "3.2 km",
      rating: 4.5,
      amount: 290,
      paymentMethod: "Card",
      notes: "Customer unavailable",
      priority: "medium",
      orderTime: "1 hour ago",
      estimatedDelivery: "Cancelled",
    },
    {
      id: "ORD-005",
      customer: "Alex Johnson",
      phone: "+1 555-0123",
      address: "567 Cedar Ave, NYC",
      status: "picked_up",
      items: 4,
      eta: "30 mins",
      distance: "5.2 km",
      rating: 4.7,
      amount: 850,
      paymentMethod: "UPI",
      notes: "Fragile items - handle with care",
      priority: "high",
      orderTime: "30 mins ago",
      estimatedDelivery: "3:15 PM",
    },
    {
      id: "ORD-006",
      customer: "Sarah Chen",
      phone: "+1 555-0456",
      address: "890 Maple Dr, NYC",
      status: "pending",
      items: 2,
      eta: "35 mins",
      distance: "3.7 km",
      rating: 4.9,
      amount: 520,
      paymentMethod: "Card",
      notes: "Call before delivery",
      priority: "medium",
      orderTime: "20 mins ago",
      estimatedDelivery: "3:45 PM",
    },
  ]);

  const deliveryAgent = {
    name: "John Doe",
    id: "DA-001",
    rating: 4.8,
    totalDeliveries: 245,
    todayDeliveries: 8,
    earnings: 1250,
    status: "active",
    completionRate: 96,
    avgDeliveryTime: "22 mins",
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Package,
      description: "Orders overview",
    },
    {
      id: "table",
      label: "Order Management",
      icon: Edit3,
      description: "Manage all orders",
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: Wallet,
      description: "Payment & statistics",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      description: "Past deliveries",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Agent profile",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-purple-500";
      case "picked_up":
        return "bg-purple-600";
      case "in_transit":
        return "bg-purple-700";
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-purple-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "picked_up":
        return "Picked Up";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-600/20 border-red-500/50";
      case "medium":
        return "text-yellow-400 bg-yellow-600/20 border-yellow-500/50";
      case "low":
        return "text-green-400 bg-green-600/20 border-green-500/50";
      default:
        return "text-gray-400 bg-gray-600/20 border-gray-500/50";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === "cancelled") {
      setSelectedOrderForCancel(orderId);
      setShowOtpModal(true);
      return;
    }

    setUpdatingStatus(orderId);

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                eta: newStatus === "delivered" ? "Delivered" : order.eta,
                estimatedDelivery:
                  newStatus === "delivered"
                    ? `Delivered at ${new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : order.estimatedDelivery,
              }
            : order
        )
      );
      setUpdatingStatus(null);
      alert(`Order ${orderId} status updated to ${getStatusText(newStatus)}`);
    }, 1000);
  };

  const handleOtpVerification = async () => {
    if (cancelOtp !== "1234") {
      alert("Invalid OTP! Please enter the correct OTP.");
      return;
    }

    if (!selectedOrderForCancel) return;

    setCancellingOrder(selectedOrderForCancel);
    setShowOtpModal(false);
    setCancelOtp("");

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderForCancel
            ? {
                ...order,
                status: "cancelled",
                eta: "Cancelled",
                estimatedDelivery: "Cancelled",
              }
            : order
        )
      );
      setCancellingOrder(null);
      setSelectedOrderForCancel(null);
      alert(`Order ${selectedOrderForCancel} has been cancelled successfully`);
    }, 1500);
  };

  // Helper: Get all orders for a customer
  const getOrdersByCustomer = (customerName: string) =>
    orders.filter((o) => o.customer === customerName);

  // Helper: Get unique customers with >1 order
  const customersWithMultipleOrders = Array.from(
    new Set(orders.map((o) => o.customer))
  ).filter((name) => getOrdersByCustomer(name).length > 1);

  // Helper: Get customer statistics
  const getCustomerStats = (customerName: string) => {
    const customerOrders = getOrdersByCustomer(customerName);
    return {
      totalOrders: customerOrders.length,
      totalAmount: customerOrders.reduce((sum, order) => sum + order.amount, 0),
      activeOrders: customerOrders.filter(
        (o) => o.status !== "delivered" && o.status !== "cancelled"
      ).length,
      completedOrders: customerOrders.filter((o) => o.status === "delivered")
        .length,
    };
  };

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [data, setData] = useState<any>(null);

  // const [userData, setUserData] = useState<any>(null);
  const [userswithproduuct, setUsersWithProducts] = useState<any>(null);
  // console.log("userData", userData);
  console.log("productdata", userswithproduuct);
  useEffect(() => {
    async function dispatchdata() {
      const res = await dispatch(users_with_prod_details());
      if (res.payload.success) {
        setUsersWithProducts(res.payload.data); // data is an array of users
        toast(res.payload.message);
      } else {
        toast(res.payload.message);
      }
    }
    dispatchdata();
  }, [dispatch]);

  const renderLeftPanel = () => (
    <div className="w-80 mt-16 bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-r border-purple-700/50 fixed h-full">
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        {/* Agent Profile */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-12 h-12 border border-purple-800 rounded-full flex items-center justify-center text-white text-md font-bold shadow-lg ">
                {deliveryAgent.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-200 ">
                {deliveryAgent.name}
              </h3>
              <p className="text-sm text-slate-400">{deliveryAgent.id}</p>
              <p className="text-xs text-purple-400 capitalize">
                {deliveryAgent.status} Agent
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full border border-slate-700/50 justify-start gap-4 h-auto p-4 text-left transition-all duration-200 rounded-lg ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-600/20 to-purple-600/30 text-purple-400 border-purple-500/50 shadow-lg"
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

        {/* Sign Out */}
        <div className="pt-6 border-t border-slate-700/50">
          <button className="w-full justify-start gap-4 h-12 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 flex items-center px-4 rounded-lg">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  // OTP Modal
  const OtpModal = () => {
    if (!showOtpModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <form
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-700/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleOtpVerification();
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              Cancel Order Confirmation
            </h3>
            <p className="text-slate-400">
              Please enter OTP to cancel order {selectedOrderForCancel}
            </p>
            <p className="text-xs text-slate-500 mt-2">(Demo OTP: 1234)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cancelOtp}
              onChange={(e) => setCancelOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowOtpModal(false);
                setCancelOtp("");
                setSelectedOrderForCancel(null);
              }}
              className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={cancelOtp.length !== 4}
              className="flex-1 px-4 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const [quickActionOrderId, setQuickActionOrderId] = useState<string | null>(
    null
  );
  const [quickActionStatus, setQuickActionStatus] = useState<string>("");

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Header */}
            <div className="mb-8 mt-16">
              <div className="flex items-center justify-center">
                <h1 className="text-3xl text-center font-bold text-slate-200 mb-2">
                  Delivery Dashboard
                </h1>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {/* Total Orders - Emerald */}
              <div className="border border-emerald-500/60 rounded-2xl p-6 shadow-2xl bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-200">
                      {orders.length}
                    </p>
                    <p className="text-emerald-300 text-sm">Total Orders</p>
                  </div>
                </div>
              </div>
              {/* Pending - Amber */}
              <div className="border border-amber-500/60 rounded-2xl p-6 shadow-2xl bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-200">
                      {orders.filter((o) => o.status === "pending").length}
                    </p>
                    <p className="text-amber-300 text-sm">Pending</p>
                  </div>
                </div>
              </div>
              {/* Active - Blue */}
              <div className="border border-blue-500/60 rounded-2xl p-6 shadow-2xl bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-200">
                      {
                        orders.filter(
                          (o) =>
                            o.status === "in_transit" ||
                            o.status === "picked_up"
                        ).length
                      }
                    </p>
                    <p className="text-blue-300 text-sm">Active</p>
                  </div>
                </div>
              </div>
              {/* Delivered - Green */}
              <div className="border border-purple-500/60 rounded-2xl p-6 shadow-2xl bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">
                      {orders.filter((o) => o.status === "delivered").length}
                    </p>
                    <p className="text-purple-300 text-sm">Delivered</p>
                  </div>
                </div>
              </div>
              {/* Total Value - Purple */}
              <div className="border border-green-500/60 rounded-2xl p-6 shadow-2xl bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-500">
                      ₹{orders.reduce((sum, order) => sum + order.amount, 0)}
                    </p>
                    {/* <p className="text-green-300 text-sm"></div> Total Value</p> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Multi-Order Customer Management */}
            {customersWithMultipleOrders.length > 0 && (
              <div className="mb-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-2xl border border-purple-700/40 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-purple-400">
                      Multi-Order Customer Management
                    </h2>
                  </div>
                  {selectedCustomer && (
                    <button
                      onClick={() => {
                        setSelectedCustomer(null);
                        setSelectedOrderId(null);
                      }}
                      className="w-8 h-8 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                      title="Close Customer Management"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                  {/* Customer Selection Card */}
                  <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/30">
                    <label className="block text-slate-400 mb-3 font-medium">
                      Select Customer:
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/50 transition-all"
                      value={selectedCustomer || ""}
                      onChange={(e) => {
                        setSelectedCustomer(e.target.value);
                        setSelectedOrderId(null);
                      }}
                      title="Select customer"
                    >
                      <option value="">-- Select Customer --</option>
                      {customersWithMultipleOrders.map((name) => (
                        <option key={name} value={name}>
                          {name} ({getOrdersByCustomer(name).length} orders)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Statistics Card */}
                  {selectedCustomer && (
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/30">
                      <label className="block text-slate-400 mb-3 font-medium">
                        Customer Statistics:
                      </label>
                      {(() => {
                        const stats = getCustomerStats(selectedCustomer);
                        return (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                              <p className="text-slate-400">Total Orders</p>
                              <p className="text-slate-200 font-bold text-lg">
                                {stats.totalOrders}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                              <p className="text-slate-400">Total Amount</p>
                              <p className="text-emerald-400 font-bold text-lg">
                                ₹{stats.totalAmount}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                              <p className="text-slate-400">Active Orders</p>
                              <p className="text-purple-400 font-bold text-lg">
                                {stats.activeOrders}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                              <p className="text-slate-400">Completed</p>
                              <p className="text-green-400 font-bold text-lg">
                                {stats.completedOrders}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Order Selection Card */}
                  {selectedCustomer && (
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/30">
                      <label className="block text-slate-400 mb-3 font-medium">
                        Select Order:
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/50 transition-all"
                        value={selectedOrderId || ""}
                        onChange={(e) => setSelectedOrderId(e.target.value)}
                        title="Select order"
                      >
                        <option value="">-- Select Order --</option>
                        {getOrdersByCustomer(selectedCustomer).map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.id} - {getStatusText(order.status)} - ₹
                            {order.amount}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Order Details Card */}
                {selectedCustomer && selectedOrderId && (
                  <div className="bg-gradient-to-r from-slate-900/70 to-slate-800/70 rounded-xl border border-purple-700/30 shadow-lg overflow-hidden">
                    {(() => {
                      const order = orders.find(
                        (o) => o.id === selectedOrderId
                      );
                      if (!order) return null;
                      return (
                        <div className="grid lg:grid-cols-3 gap-0">
                          {/* Order Information */}
                          <div className="lg:col-span-2 p-6">
                            <div className="flex items-center gap-3 mb-6">
                              <div
                                className={`w-12 h-12 ${getStatusColor(
                                  order.status
                                )} rounded-xl flex items-center justify-center`}
                              >
                                <ShoppingBag className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-purple-400">
                                  Order {order.id}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                                    order.priority
                                  )}`}
                                >
                                  {order.priority} priority
                                </span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                                  <h4 className="text-slate-400 text-sm mb-3">
                                    Customer Details
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400 text-sm">
                                        Name:
                                      </span>
                                      <span className="text-slate-200 font-medium">
                                        {order.customer}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400 text-sm">
                                        Phone:
                                      </span>
                                      <span className="text-slate-300">
                                        {order.phone}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                                  <h4 className="text-slate-400 text-sm mb-3">
                                    Order Details
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400 text-sm">
                                        Amount:
                                      </span>
                                      <span className="text-emerald-400 font-semibold">
                                        ₹{order.amount}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400 text-sm">
                                        Status:
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                          order.status === "pending"
                                            ? "bg-purple-600/20 text-purple-400 border-purple-500/50"
                                            : order.status === "picked_up"
                                            ? "bg-purple-600/30 text-purple-300 border-purple-400/50"
                                            : order.status === "in_transit"
                                            ? "bg-blue-600/20 text-blue-400 border-blue-500/50"
                                            : order.status === "delivered"
                                            ? "bg-green-600/20 text-green-400 border-green-500/50"
                                            : "bg-red-600/20 text-red-400 border-red-500/50"
                                        }`}
                                      >
                                        {getStatusText(order.status)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                                  <h4 className="text-slate-400 text-sm mb-3">
                                    Delivery Info
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400 text-sm">
                                        ETA:
                                      </span>
                                      <span className="text-slate-300">
                                        {order.eta}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400 text-sm">
                                        Distance:
                                      </span>
                                      <span className="text-slate-300">
                                        {order.distance}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                                  <h4 className="text-slate-400 text-sm mb-3">
                                    Address
                                  </h4>
                                  <p className="text-slate-300 text-sm">
                                    {order.address}
                                  </p>
                                </div>

                                {order.notes && (
                                  <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                                    <h4 className="text-slate-400 text-sm mb-3">
                                      Notes
                                    </h4>
                                    <p className="text-slate-300 text-sm italic">
                                      {order.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions Panel */}
                          <div className="bg-slate-800/60 p-6 border-l border-slate-700/50">
                            <h4 className="text-lg font-semibold text-slate-200 mb-6">
                              Order Management
                            </h4>

                            {/* Status Change Dropdown */}
                            {order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <div className="mb-6">
                                  <label className="block text-slate-400 mb-3 font-medium text-sm">
                                    Update Status:
                                  </label>
                                  <select
                                    title="Update Order Status"
                                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/50 transition-all"
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleStatusChange(
                                          order.id,
                                          e.target.value
                                        );
                                        e.target.value = ""; // Reset dropdown
                                      }
                                    }}
                                    disabled={updatingStatus === order.id}
                                  >
                                    <option value="">
                                      -- Update Status --
                                    </option>
                                    {order.status === "pending" && (
                                      <option value="picked_up">
                                        Mark as Picked Up
                                      </option>
                                    )}
                                    {order.status === "picked_up" && (
                                      <>
                                        <option value="in_transit">
                                          Mark In Transit
                                        </option>
                                        <option value="delivered">
                                          Mark as Delivered
                                        </option>
                                      </>
                                    )}
                                    {order.status === "in_transit" && (
                                      <option value="delivered">
                                        Mark as Delivered
                                      </option>
                                    )}
                                    <option value="cancelled">
                                      Cancel Order (Requires OTP)
                                    </option>
                                  </select>
                                </div>
                              )}

                            {/* Status Display for Completed Orders */}
                            {order.status === "delivered" && (
                              <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-500/50 mb-6">
                                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <span className="text-green-400 font-medium">
                                  Order Completed Successfully
                                </span>
                              </div>
                            )}

                            {order.status === "cancelled" && (
                              <div className="text-center p-4 bg-red-600/20 rounded-lg border border-red-500/50 mb-6">
                                <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <span className="text-red-400 font-medium">
                                  Order Cancelled
                                </span>
                              </div>
                            )}

                            {/* Communication & Navigation */}
                            <div className="space-y-4">
                              <h5 className="text-sm font-medium text-slate-400">
                                Quick Actions
                              </h5>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() =>
                                    window.open(`tel:${order.phone}`)
                                  }
                                  className="p-3 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-all flex items-center justify-center"
                                  title="Call Customer"
                                >
                                  <Phone className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    window.open(
                                      `https://maps.google.com/?q=${encodeURIComponent(
                                        order.address
                                      )}`,
                                      "_blank"
                                    )
                                  }
                                  className="p-3 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition-all flex items-center justify-center"
                                  title="Navigate"
                                >
                                  <Navigation className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Status Update Indicator */}
                            {updatingStatus === order.id && (
                              <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm">
                                <Timer className="w-4 h-4 animate-spin" />
                                Updating order status...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
            {/* Orders Cards Grid */}
            {userswithproduuct &&
              Array.isArray(userswithproduuct) &&
              userswithproduuct.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userswithproduuct.map((user: any, idx: number) => {
                    const totalValue =
                      user.products?.reduce(
                        (sum: number, prod: any) =>
                          sum + (prod.productprice || 0),
                        0
                      ) || 0;

                    return (
                      <div
                        key={user.username + idx}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-700/50 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 hover:border-purple-600/70"
                      >
                        {/* User Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-200 text-lg">
                                {user.username}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {user.userphone ? (
                                  <>
                                    <Phone className="w-4 h-4 text-emerald-400" />
                                    <span className="text-slate-300 text-sm">
                                      {user.userphone}
                                    </span>
                                  </>
                                ) : (
                                  <>

                                    <span className="text-red-400 text-sm ">
                                      Null
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* User Stats */}
                          <div className="text-right">
                            <div className="text-emerald-400 font-bold text-xl">
                              ₹{totalValue.toLocaleString()}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {user.products?.length || 0} products
                            </div>
                          </div>
                        </div>

                        {/* Products Section */}
                        {user.products && user.products.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-700/50">
                              <div className="w-6 h-6 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="text-purple-400 font-semibold text-sm">
                                Products
                              </span>
                              <div className="ml-auto bg-slate-700/50 px-2 py-1 rounded-full">
                                <span className="text-slate-300 text-xs">
                                  {user.products.length}
                                </span>
                              </div>
                            </div>
                            {/* Removed max-h-60 overflow-y-auto custom-scrollbar to show all products without scroll */}
                            <div className="space-y-3">
                              {user.products.map((prod: any, i: number) => {
                                const getStatusColor = (status: string) => {
                                  switch (status?.toLowerCase()) {
                                    case "pending":
                                      return "bg-amber-600/20 text-amber-300 border-amber-500/40";
                                    case "shipped":
                                      return "bg-blue-600/20 text-blue-300 border-blue-500/40";
                                    case "delivered":
                                      return "bg-green-600/20 text-green-300 border-green-500/40";
                                    case "cancelled":
                                      return "bg-red-600/20 text-red-300 border-red-500/40";
                                    default:
                                      return "bg-gray-600/20 text-gray-300 border-gray-500/40";
                                  }
                                };

                                const getStatusIcon = (status: string) => {
                                  switch (status?.toLowerCase()) {
                                    case "pending":
                                      return "⏳";
                                    case "shipped":
                                      return "🚚";
                                    case "delivered":
                                      return "✅";
                                    case "cancelled":
                                      return "❌";
                                    default:
                                      return "📦";
                                  }
                                };

                                return (
                                  <div
                                    key={i}
                                    className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200"
                                  >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-200 truncate text-sm">
                                          {prod.productname}
                                        </h4>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <div className="font-bold text-emerald-400 text-sm">
                                          ₹{prod.productprice?.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                          prod.productdeliverystatus
                                        )}`}
                                      >
                                        <span className="text-xs">
                                          {getStatusIcon(
                                            prod.productdeliverystatus
                                          )}
                                        </span>
                                        <span className="capitalize">
                                          {prod.productdeliverystatus}
                                        </span>
                                      </span>

                                 
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-700/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Package className="w-8 h-8 text-slate-500" />
                            </div>
                            <p className="text-slate-400 font-medium">
                              No products found
                            </p>
                            <p className="text-slate-500 text-sm mt-1">
                              This user hasn't ordered anything yet
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
          </>
        );

      case "table":
        return (
          <>
            <div className="mb-8 mt-16 flex items-center justify-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Order Management
              </h1>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-200"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  title="Filter by order status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-200 min-w-[140px]"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Enhanced Orders Table */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-purple-700/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-purple-700/20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold text-purple-300">
                    All Orders ({filteredOrders.length})
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/70 border-b border-purple-700/20">
                    <tr>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                        Status
                      </th>
                      {/* <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">Priority</th> */}
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                        Amount
                      </th>
                      {/* <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">Created</th> */}
                      <th className="text-left p-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-700/10">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-800/40 transition-colors duration-200 group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-purple-400 font-medium">
                              {order.id}
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(order.id)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded"
                              title="Copy order ID"
                            >
                              <Copy className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {order.customer.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${
                                order.status === "pending"
                                  ? "bg-purple-600/30 text-purple-300 border-purple-400/50 shadow-purple-500/20"
                                  : order.status === "picked_up"
                                  ? "bg-amber-600/30 text-amber-300 border-amber-400/50 shadow-amber-500/20"
                                  : order.status === "in_transit"
                                  ? "bg-blue-600/30 text-blue-300 border-blue-400/50 shadow-blue-500/20"
                                  : order.status === "delivered"
                                  ? "bg-green-600/30 text-green-300 border-green-400/50 shadow-green-500/20"
                                  : "bg-red-600/30 text-red-300 border-red-400/50 shadow-red-500/20"
                              } shadow-lg`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="text-emerald-400 font-bold text-lg">
                            ₹{order.amount}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {order.status !== "delivered" &&
                            order.status !== "cancelled" ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={order.status}
                                  title="Change order status"
                                  onChange={(e) =>
                                    handleStatusChange(order.id, e.target.value)
                                  }
                                  disabled={updatingStatus === order.id}
                                  className="bg-slate-700/80 border border-slate-600/50 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-200"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="picked_up">Picked Up</option>
                                  <option value="in_transit">In Transit</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">
                                    Cancel Order
                                  </option>
                                </select>

                                <button
                                  onClick={() =>
                                    console.log("View order details:", order.id)
                                  }
                                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                                  title="View details"
                                ></button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                    order.status === "delivered"
                                      ? "bg-green-600/30 text-green-300 border border-green-400/50"
                                      : "bg-red-600/30 text-red-300 border border-red-400/50"
                                  } backdrop-blur-sm shadow-lg`}
                                >
                                  {order.status === "delivered"
                                    ? "✓ Completed"
                                    : "✗ Cancelled"}
                                </span>

                                <button
                                  onClick={() =>
                                    console.log("View order details:", order.id)
                                  }
                                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                                  title="View details"
                                >
                                  {/* <Eye className="w-4 h-4" /> */}
                                </button>
                              </div>
                            )}

                            {updatingStatus === order.id && (
                              <Timer className="w-4 h-4 animate-spin text-purple-400" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Empty State */}
              {filteredOrders.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-3">
                    No orders found
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria to find orders."
                      : "No orders have been placed yet. Orders will appear here once customers start placing them."}
                  </p>
                  {(searchTerm || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Coming Soon
              </h3>
              <p className="text-slate-500">
                This section is under development
              </p>
              order
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 flex">
      {renderLeftPanel()}
      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        {renderMainContent()}
      </main>
      <OtpModal />
    </div>
  );
}
