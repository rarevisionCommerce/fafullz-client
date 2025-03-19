import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import { Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";

function Dash() {
  const axios = useAxiosPrivate();

  // seller id from auth
  const { auth } = useAuth();
  const sellerId = auth?.jabberId;
  const userId = auth?.userId;

  //   fetching system   infor
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


  // check if its sato
  const today = new Date();
  const dayOfWeek = today.getDay() + 1;
  //end of fetching payments------------------

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div className="bg-light min-h-screen py-4 px-1 md:px-6 shadow-md">
      <h1 className="text-lg mb-[10px] mt-[0px] ">Users</h1>
      {/* users div  */}
      {loadingInfo ? (
        <div className="min-h-[100px] bg-light  text-gray-700 px-1 py-[20px] mb-7 shadow-md hover:bg-opacity-90 h ">
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center px-[50px] ">
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
          </div>
        </div>
      ) : (
        <div className=" flex flex-col  md:grid md:grid-cols-3 gap-5 bg-gray-50 py-[20px] px-5 mb-7 ">
          <div className="min-h-[100px] bg-light    text-gray-700 px-1 py-2 shadow-md hover:bg-opacity-90 h ">
            <Link to={"/admin-dash/sellers"}>
              <h1 className="text-lg font-semibold text-center cursor-pointer underline">
                Sellers
              </h1>
            </Link>
            <div className="text-center text-lg font-semibold my-4  ">
              {dashboardData?.data?.totalSellers || 0}
            </div>
          </div>
          <div className="min-h-[100px] bg-light   text-gray-700 px-1 py-2 shadow-md hover:bg-opacity-90 h ">
            <Link to={"/admin-dash/buyers"}>
              <h1 className="text-lg font-semibold text-center cursor-pointer underline">
                Buyers
              </h1>
            </Link>
            <div className="text-center text-lg font-semibold my-4  ">
              {dashboardData?.data?.totalBuyers || 0}
            </div>
          </div>
          <div className="min-h-[100px] bg-light   text-gray-700 px-1 py-2  shadow-md hover:bg-opacity-90 h ">
            <Link to={"/admin-dash/admins"}>
              <h1 className="text-lg font-semibold text-center cursor-pointer underline">Managers</h1>
            </Link>
          </div>
        </div>
      )}

      <h1 className="text-lg mb-[10px] mt-[30px] ">Products & Sales</h1>
      <div className="bg-gray-200 px-2">
        {loadingInfo ? (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center p-[50px] ">
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
          </div>
        ) : (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center p-[50px] ">
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 h ">
              <h1 className="text-lg font-semibold text-center">
                All Products
              </h1>
              <div className="text-center text-lg font-semibold my-4  ">
                {dashboardData?.data?.totalProducts || 0}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Sold Products
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                {dashboardData?.data?.totalSoldProducts || 0}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Total Profit
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                ${formatCurrency(dashboardData?.data?.totalProfit || 0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dash;
