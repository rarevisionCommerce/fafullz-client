import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PulseLoader from "react-spinners/PulseLoader";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

function ProfitStats() {
  const axios = useAxiosPrivate();
  const [profitFilter, setProfitFilter] = useState("weekly");

  const getProfitData = async () => {
    return await axios.get(`/admin/profit?filter=${profitFilter}`);
  };

  const { isLoading: loadingProfitData, data: profitDataResponse } = useQuery(
    ["profit-data", profitFilter],
    getProfitData,
    {
      retry: 0,
      onError: (error) => {
        console.error("Failed to fetch profit data", error);
      },
      refetchOnWindowFocus: false,
    }
  );

  const profitData = profitDataResponse?.data || [];

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6 mb-8 mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Profit Overview</h2>
          <p className="text-sm text-gray-400">Total profits generated over time</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setProfitFilter("weekly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              profitFilter === "weekly"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setProfitFilter("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              profitFilter === "monthly"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setProfitFilter("yearly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              profitFilter === "yearly"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        {loadingProfitData ? (
          <div className="w-full h-full flex items-center justify-center">
            <PulseLoader color="#16a34a" />
          </div>
        ) : profitData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `$${value}`}
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
                formatter={(value) => [`$${value.toFixed(2)}`, 'Profit']}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#16a34a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorProfit)"
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No profit data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfitStats;
