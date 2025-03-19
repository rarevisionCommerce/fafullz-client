import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Loader, Pagination } from "@mantine/core";
import filterOptions from "../filterOptions";
import countryList from "react-select-country-list";
import { useCreateCart } from "../../hooks/useCreateCart";
import useAuth from "../../hooks/useAuth";
import { CgShoppingCart } from "react-icons/cg";

function Dumps() {
    const axios = useAxiosPrivate();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const queryClient = useQueryClient();

  const { auth } = useAuth();
  const createCart = useCreateCart();

  //fetching files
  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
  const [bank, setBank] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [bin, setBin] = useState("");
  const [svc, setSvc] = useState("");

  const fetchDumps = () => {
    return axios.get(
      `/dumps?page=${activePage}&perPage=${perPage}&bank=${bank}&type=${type}&country=${country}&level=${level}&bin=${bin}&svc=${svc}`
    );
  };

  const {
    isLoading: loadingDumps,
    data: dumpsData,
    isRefetching: refetchingDumps,
    refetch,
  } = useQuery(["dumps", activePage], fetchDumps, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(dumpsData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, bank, type, country, level, bin, svc]);

  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setBank("");
    setCountry("");
    setType("");
    setPerPage(20);
    setLevel("");
    setBin("");
    setSvc("");
  };

  const onSubmitting = (ProductId) => {
    const data = {
      userId: auth?.userId,
      productId: ProductId,
      productType: "dump",
    };
    createCart(data);
  };

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


   // fetching user cart
   function useShoppingCart() {
    return useQuery(
      [`shoppingCartDump-${auth?.userId}`],
      async () => {
        const { data } = await axios.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 3000,
        // 5 seconds in milliseconds
      }
    );
  }
  const { isLoading: loadingUserCart, data: cartData } = useShoppingCart();

  // func to checkm if a product is in cart
  function isProductInCart(productId) {
    for (let i = 0; i < cartData?.cart?.length; i++) {
      // Check if the current item's productId matches the target productId
      if (cartData?.cart[i]?.productId === productId) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="bg-light min-h-screen py-4 px-1 md:px-6 shadow-md">
      <h1 className="mb-4 text-center font-bold  ">Dumps </h1>
      <div className="flex flex-col ">
        {/* Filters div */}
        <form
          action=""
          className="bg-slate-100 bg-opacity-80 pb-5 md:pb-9 border shadow-sm rounded-t-lg"
        >
          <div className="bg-slate-200 py-6 mb-3 "></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-1 md:px-4">
            <div className="flex flex-col gap-">
              <h1>Bank:</h1>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={bank}
                onChange={(e) => {
                  setBank(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-">
              <h1>Country:</h1>
              <Select
                options={countryOptions}
                value={country && country?.label}
                onChange={(selectOption) => {
                  setCountry(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-">
              <h1>Type</h1>
              <Select
                options={filterOptions?.cardsType}
                value={type && type?.label}
                onChange={(selectOption) => {
                  setType(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-">
              <h1>Level</h1>
              <Select
                options={filterOptions?.cardsLevel}
                value={level && level?.label}
                onChange={(selectOption) => {
                  setLevel(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col w-full  ">
              <label htmlFor="">Bin</label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={bin}
                onChange={(e) => {
                  setBin(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col w-full  ">
              <label htmlFor="">SVC</label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={svc}
                onChange={(e) => {
                  setSvc(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-">
              <h1>Per Page</h1>
              <select
                className="p-2 bg-light "
                value={perPage}
                onChange={(e) => {
                  setPerPage(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select per page</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-5 px-1 md:px-4 ">
            <h1>Total: {dumpsData?.data?.count}</h1>
            <h1
              className="bg-primary cursor-pointer text-light py-1 px-5 rounded-md hover:bg-[#064919]  "
              onClick={resetFilters}
            >
              Reset filter
            </h1>
          </div>
        </form>
      </div>
      <div className="my-[30px]">
        <div className="my-3">
          <Pagination
            total={totalPages || 0}
            page={activePage}
            color="green"
            onChange={setPage}
          />
        </div>
        {/* table */}
        <div className="overflow-y-auto my-3 rounded-sm ">
          <table className="w-full table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Bin
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  SVC
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  EXP
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Country
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Bank
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Type
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Level
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  T1
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  T2
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Seller
                </th>
                <th
                  scope="col"
                  className="border-collapse border border-slate-500 py-2 px-3"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="border-collapse border border-slate-500 py-2 px-3"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {refetchingDumps || loadingDumps ? (
                <div className="flex justify-center py-4 pr-6 items-center">
                  <p colSpan={10} className="text-center pl-[200px]">
                    {" "}
                    <PulseLoader color="#6ba54a" size={10} />
                  </p>
                </div>
              ) : dumpsData?.data?.message ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    {dumpsData?.data?.message}
                  </td>
                </tr>
              ) : (
                dumpsData?.data?.files?.map((file, index) => {
                  return (
                    <tr
                      className="odd:bg-gray-50 hover:bg-gray-100"
                      key={index}
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.bin}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.svc}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.exp}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.country}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file.bank}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.type}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.level}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.track1}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.track2}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.sellerId}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        ${formatCurrency(file?.price)}
                      </td>
                      <td className=" border-collapse border-b border-slate-500 py-3 px-3 text-center">
                        
                      {
                          loadingDumps || loadingUserCart ?
                          <span>
                            <Loader color="green" size={17} />
                          </span>
                          :
                        <span>

                        {
                          isProductInCart(file?._id) ? 
                          <span>
                            In Cart✅
                          </span>
                          :
                        <span
                          onClick={() => onSubmitting(file?._id)}
                          className="flex gap-2 cursor-pointer bg-primary py-1 px-2 text-center items-center justify-center rounded-md text-light hover:bg-secondary"
                        >
                          <h1 className="">{"Add"}</h1>
                          <CgShoppingCart size={17} />
                        </span>

                        }
                        </span>
                        }
                      
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dumps;
