import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import { Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProfitStats from "./ProfitStats";

function Dash() {
  const axios = useAxiosPrivate();

  // seller id from auth
  const { auth } = useAuth();
  const sellerId = auth?.jabberId;
  const userId = auth?.userId;

  // fetching system infor Admin
  const fetchInfo = () => {
    return axios.get(`/admin`);
  };

  const { isLoading: loadingInfo, data: dashboardData } = useQuery(
    ["admin-"],
    fetchInfo,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );

  // fetching Dash Overview data
  const getDashboardData = async () => {
    return await axios.get(`/admin/stats`);
  };

  const {
    isLoading: loadingDashData,
    data: dashDataResponse,
    error: dashError,
    isError: isDashError,
    refetch,
  } = useQuery(["dashboard-data"], getDashboardData, {
    retry: 0,
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch dashboard data";
      toast.error(errorMessage);
    },
  });

  const [salesFilter, setSalesFilter] = useState("daily");

  const getSalesData = async () => {
    return await axios.get(`/admin/sales?filter=${salesFilter}`);
  };

  const { isLoading: loadingSalesData, data: salesDataResponse, refetch: refetchSales } = useQuery(
    ["sales-data", salesFilter],
    getSalesData,
    {
      retry: 0,
      onError: (error) => {
        console.error("Failed to fetch sales data", error);
      },
    }
  );

  const dashData = dashDataResponse?.data || {};
  const salesData = salesDataResponse?.data || [];


  const topClients = dashData.topClients || [];
  const bases = dashData.result || [];

  // clear profits
  const clearAllProfits = async () => {
    try {
      if (!dashboardData?.data?.totalProfit) {
        toast.error("No profits to clear");
        return;
      }
      // confirm before clearing profits
      const confirm = window.confirm("Are you sure you want to clear all profits?");
      if (!confirm) return;

      await axios.post(`/admin/clear-profits`);
      refetchSales();
      refetch();
      toast.success("All profits cleared");
    } catch (error) {
      toast.error("Failed to clear profits");
    }
  };


 
 

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "sold":
        return "text-green-400 bg-green-900";
      case "available":
        return "text-blue-400 bg-blue-900";
      default:
        return "text-gray-300 bg-gray-700";
    }
  };

  const calculatePercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  function formatCurrency(number) {
    if (number === undefined || number === null) return "0.00";
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="bg-gray-900 min-h-screen py-4 px-1 md:px-6 shadow-md text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100">
          Dashboard Overview
        </h1>
      </div>

      <h2 className="text-lg mb-[10px] mt-[0px] font-bold text-gray-300">System Users</h2>
      {/* users div  */}
      {loadingInfo ? (
        <div className="min-h-[100px] bg-gray-800  text-gray-200 px-1 py-[20px] mb-7 shadow-md hover:bg-opacity-90 h ">
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center px-[50px] ">
            <Skeleton height={90} radius="sm" color="#374151" />
            <Skeleton height={90} radius="sm" color="#374151" />
            <Skeleton height={90} radius="sm" color="#374151" />
          </div>
        </div>
      ) : (
        <div className=" flex flex-col  md:grid md:grid-cols-3 gap-5 bg-gray-900 py-[20px] px-0 mb-7 ">
          <div className="min-h-[100px] bg-gray-800 rounded-lg border border-gray-700 text-gray-200 px-1 py-4 shadow-md hover:bg-gray-700 transition-all duration-200">
            <Link to={"/admin-dash/sellers"}>
              <h1 className="text-lg font-semibold text-center cursor-pointer text-blue-400 hover:text-blue-300">
                Sellers
              </h1>
            </Link>
            <div className="text-center text-2xl font-bold my-2 text-white">
              {dashboardData?.data?.totalSellers || 0}
            </div>
          </div>
          <div className="min-h-[100px] bg-gray-800 rounded-lg border border-gray-700 text-gray-200 px-1 py-4 shadow-md hover:bg-gray-700 transition-all duration-200">
            <Link to={"/admin-dash/buyers"}>
              <h1 className="text-lg font-semibold text-center cursor-pointer text-blue-400 hover:text-blue-300">
                Buyers
              </h1>
            </Link>
            <div className="text-center text-2xl font-bold my-2 text-white">
              {dashboardData?.data?.totalBuyers || 0}
            </div>
          </div>
          <div className="min-h-[100px] bg-gray-800 rounded-lg border border-gray-700 text-gray-200 px-1 py-4 shadow-md hover:bg-gray-700 transition-all duration-200 flex items-center justify-center">
            <Link to={"/admin-dash/admins"}>
              <h1 className="text-lg font-semibold text-center cursor-pointer text-blue-400 hover:text-blue-300">Managers</h1>
            </Link>
          </div>
        </div>
      )}

      <h2 className="text-lg mb-[10px] mt-[30px] font-bold text-gray-300">Products & Sales</h2>
      <div className="bg-gray-900 mb-8">
        {loadingInfo ? (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center p-[50px] ">
            <Skeleton height={90} radius="sm" color="#374151" />
            <Skeleton height={90} radius="sm" color="#374151" />
            <Skeleton height={90} radius="sm" color="#374151" />
          </div>
        ) : (
          <div className="flex flex-col w-full md:grid md:grid-cols-3 gap-5 md:content-center py-5">
            <div className="min-h-[100px] bg-gray-800 rounded-lg border border-gray-700 text-gray-200 px-1 py-4 shadow-md hover:bg-gray-700 transition-all duration-200">
              <h1 className="text-lg font-semibold text-center text-blue-400">
                All Products
              </h1>
              <div className="text-center text-2xl font-bold my-2 text-white">
                {dashboardData?.data?.totalProducts || 0}
              </div>
            </div>
            <div className="min-h-[100px] bg-gray-800 rounded-lg border border-gray-700 text-gray-200 px-1 py-4 shadow-md hover:bg-gray-700 transition-all duration-200">
              <h1 className="text-lg font-semibold text-center text-blue-400">
                Sold Products
              </h1>
              <div className="text-center text-2xl font-bold my-2 text-white">
                {dashboardData?.data?.totalSoldProducts || 0}
              </div>
            </div>
            <div className="min-h-[100px] bg-gray-800 rounded-lg border border-gray-700 text-gray-200 px-1 py-4 shadow-md hover:bg-gray-700 transition-all duration-200">
              <h1 className="text-lg font-semibold text-center text-green-400">
                Total Profit
              </h1>
              <div className="text-center text-2xl font-bold my-2 text-white">
                ${formatCurrency(dashboardData?.data?.totalProfit || 0)}
              </div>
              <button
                onClick={() => clearAllProfits()}
                disabled={loadingSalesData || !dashboardData?.data?.totalProfit}
                className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full mt-3 ${!dashboardData?.data?.totalProfit ? 'bg-slate-500' : ''}`}
              >
                Clear Profits
              </button>
            </div>
          </div>
        )}
      </div>

      {loadingSalesData ? (
        <div className="flex justify-center items-center py-12">
          <PulseLoader color="#3b82f6" />
        </div>
      ) : isDashError ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">
              Error loading platform statistics
            </div>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <ProfitStats />

          {/* Sales Graph */}
          <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
                <p className="text-sm text-gray-400">Total items sold over time</p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => setSalesFilter("daily")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    salesFilter === "daily"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Daily (Last 5 Days)
                </button>
                <button
                  onClick={() => setSalesFilter("monthly")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    salesFilter === "monthly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSalesFilter("yearly")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    salesFilter === "yearly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              {loadingSalesData ? (
                <div className="w-full h-full flex items-center justify-center">
                  <PulseLoader color="#3b82f6" />
                </div>
              ) : salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ stroke: '#4B5563', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No sales data available.
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Clients */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white">
                    Top Clients
                  </h2>
                  <p className="text-sm text-gray-400">
                    Clients with highest balances
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topClients.map((client, index) => (
                      <div
                        key={client.username}
                        className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-900 bg-opacity-40 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-400">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">
                              {client.username}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-100">
                            ${client.balance?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Base Statistics */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white">
                    Base Statistics
                  </h2>
                  <p className="text-sm text-gray-400">
                    Status breakdown for each base
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {bases.map((base) => (
                      <div
                        key={base.base}
                        className="border border-gray-700 bg-gray-800 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-white">
                            {base.base}
                          </h3>
                          <span className="text-sm text-gray-400">
                            Total: {base.totalCount.toLocaleString()} items
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {base.statuses.map((statusData) => (
                            <div key={statusData.status} className="text-center">
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  statusData.status,
                                )}`}
                              >
                                {statusData.status}
                              </div>
                              <div className="mt-2">
                                <p className="text-2xl font-bold text-white">
                                  {statusData.count.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {calculatePercentage(
                                    statusData.count,
                                    base.totalCount,
                                  )}
                                  %
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Status Distribution</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="flex h-2 rounded-full overflow-hidden">
                              {base.statuses.map((statusData, index) => (
                                <div
                                  key={statusData.status}
                                  className={`${
                                    statusData.status.toLowerCase() === "sold"
                                      ? "bg-blue-500"
                                      : statusData.status.toLowerCase() ===
                                          "available"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                  }`}
                                  style={{
                                    width: `${calculatePercentage(
                                      statusData.count,
                                      base.totalCount,
                                    )}%`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dash;

