import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Pagination } from "@mantine/core";
import filterOptions from "../filterOptions";
import { useCreateCart } from "../../hooks/useCreateCart";
import useAuth from "../../hooks/useAuth";
import { CgShoppingCart } from "react-icons/cg";
import { toast } from "react-toastify";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';


function TextNow() {
    const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const createCart = useCreateCart();

  const [category, setCategory] = useState("");
  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const fetchFiles = () => {
    return axios.get(
      `/mails?page=${activePage}&perPage=${perPage}&category=${category}`
    );
  };

  const {
    isLoading: loadingMails,
    data: mailData,
    refetch,
    isRefetching: refetchingMails,
  } = useQuery(["mails", activePage], fetchFiles, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(mailData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, category, perPage]);
  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setCategory("");
    setPerPage(20);
  };

  function isProductInLocalStorage(productId) {
    if (products) {
      return products.some((product) => product?.productId === productId);
    }
    return false;
  }


  // fetching category
  const fetchCategories = () => {
    return axios.get(`/categories/mail`)
  }

  const { isLoading: loadingCategories, data: categoriesData } = useQuery(
    [`mailCategory`],
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



  const onSubmitting = (ProductId) => {

    if(isProductInLocalStorage(ProductId)){
      toast.info("Item already in cart")
    }else{

      const data = {
        userId: auth?.userId,
        productId: ProductId,
        productType: "mail",
      };
      createCart(data);
    }
  };

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

    // fetching user cart
    function useShoppingCart() {
      return useQuery(
        [`shoppingCartMail-${auth?.userId}`],
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
      <h1 className="mb-4 text-center font-bold  ">Text Now/ Mail </h1>
      <div className="flex flex-col ">
        {/* Filters div */}
        <form
          action=""
          className="bg-slate-100 bg-opacity-80 pb-5 md:pb-9 border shadow-sm rounded-t-lg"
        >
          <div className="bg-slate-200 py-6 mb-3 "></div>
          <div className="flex justify-center items-center gap-3 px-1 md:px-4">
            <div className="flex flex-col gap-3 w-full ">
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

            <div className="flex flex-col gap-3 w-full ">
              <h1>OnPage:</h1>
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
            <h1>Total: {mailData?.data?.count || 0}</h1>
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
      </div>

      {/* table */}
      <div className="my-[30px]">
        {/* table */}
        <div className="overflow-y-auto my-3 rounded-sm">
          <table className="w-full table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
Id                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Category
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
              {refetchingMails || loadingMails ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={10} className="text-center pl-[200px]">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : mailData?.data?.message ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    {mailData?.data?.message}
                  </td>
                </tr>
              ) : (
                mailData?.data?.mails?.map((account, index) => {
                  return (
                    <tr
                      className="odd:bg-gray-50 hover:bg-gray-100"
                      key={index}
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                      {index + 1}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        {account?.category}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        ${formatCurrency(account?.price?.price)}
                      </td>
                      <td className=" border-collapse border-b border-slate-500 py-3 px-3 text-center">
                      {
                          loadingMails || loadingUserCart ?
                          <span>
                            <Loader color="green" size={17} />
                          </span>
                          :
                        <span>

                        {
                          isProductInCart(account?._id) ? 
                          <span>
                            In Cart✅
                          </span>
                          :
                        <span
                          onClick={() => onSubmitting(account?._id)}
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

export default TextNow;
