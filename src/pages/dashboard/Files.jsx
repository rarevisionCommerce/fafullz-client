import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Pagination } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import filterOptions from "../filterOptions";
import countryList from "react-select-country-list";
import { useCreateCart } from "../../hooks/useCreateCart";
import useAuth from "../../hooks/useAuth";
import { CgShoppingCart } from "react-icons/cg";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';


function Files() {
    const axios = useAxiosPrivate();
  const countryOptions = useMemo(() => countryList().getData(), []);

  const { auth } = useAuth();
  const createCart = useCreateCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    resetField,
    control,
  } = useForm();

  //fetching files
  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const fetchFiles = () => {
    return axios.get(
      `/files?page=${activePage}&perPage=${perPage}&category=${category}&state=${state}&country=${country}`
    );
  };

  const {
    isLoading: loadingFiles,
    data: filesData,
    refetch,
    isRefetching: refetchingFiles,
  } = useQuery(["files", activePage], fetchFiles, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });


  const totalPages = Math.ceil(filesData?.data?.count / perPage);
  
  // fetching category
  const fetchCategories = () => {
    return axios.get(`/categories/file`)
  }

  const { isLoading: loadingCategories, data: categoriesData } = useQuery(
    [`fileCategory`],
    fetchCategories,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  //end of fetching categories------------------
   const categoriesOptions = [{}]
  categoriesData?.data?.categories?.map((item, index) => {
    categoriesOptions.push({
      label: item.category,
      value: item.category,
    })
  })

  // pagination refetch
  useEffect(() => {
    // queryClient.invalidateQueries(['accounts', activePage])
    refetch();
  }, [activePage, category, state, country, perPage]);
  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setCategory("");
    setState("");
    setCountry("");
    setPerPage(20);
  };

  const onSubmitting = (ProductId) => {
    const data = {
      userId: auth?.userId,
      productId: ProductId,
      productType: "file",
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
      [`shoppingCartfiles-${auth?.userId}`],
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
      <h1 className="mb-4 text-center  ">
        Refund for <span className="font-bold">24h. Attention!!!</span> Login
        only from a PC, not a mobile phone! From dirty IP addresses, there will
        be no return!!!{" "}
      </h1>
      <div className="flex flex-col ">
        {/* Filters div */}
        <form
          action=""
          className="bg-slate-100 bg-opacity-80 pb-5 md:pb-9 border shadow-sm rounded-t-lg"
        >
          <div className="bg-slate-200 py-6 mb-3 "></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-1 md:px-4">
            <div className="flex flex-col gap-">
              <h1>Category:</h1>
             {
                loadingCategories ?
                <div className="text-center">
                    <PulseLoader color="#6ba54a" size={10} />
                  </div>
                :

              <Select
                options={categoriesOptions}
                value={category && category?.label}
                onChange={(selectOption) => {
                  setCategory(selectOption?.value);
                }}
              />
              }
            </div>
            <div className="flex flex-col gap-">
              <h1>State:</h1>

              <Select
                options={filterOptions?.state}
                value={state && state.label}
                onChange={(selectOption) => {
                  setState(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>Country:</h1>
              <Select
                options={countryOptions}
                value={country && country.label}
                onChange={(selectOption) => {
                  setCountry(selectOption?.value);
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
            <h1>Total: {filesData?.data?.count || 0}</h1>
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
        <div className="overflow-y-auto my-3 rounded-sm">
          <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Category
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Description
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  State
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Country
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Size
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
              {refetchingFiles || loadingFiles ? (
                <div className="flex justify-center py-4 pr-6 items-center">
                  <p colSpan={10} className="text-center pl-[200px]">
                    {" "}
                    <PulseLoader color="#6ba54a" size={10} />
                  </p>
                </div>
              ) : filesData?.data?.message ? (
                <tr>
                  <td
                    colSpan={6}
                    className="border-collapse  border-b border-slate-500 py-2 px-3"
                  >
                    {filesData?.data?.message}
                  </td>
                </tr>
              ) : (
                filesData?.data?.files?.map((file, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.category}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {file?.description}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.state}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.country}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {file?.size}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        ${formatCurrency(file?.price)}
                      </td>
                      <td className=" border-collapse border-b border-slate-500 py-3 px-3 text-center">
                      {
                          loadingFiles || loadingUserCart ?
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

export default Files;
