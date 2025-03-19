import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mantine/core";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

function TextNowProducts(props) {
    const axios = useAxiosPrivate();
  const [status, setStatus] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [activePage, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { auth } = useAuth();

  const fetchProducts = () => {
    return axios.get(
      `/mails/all/${props?.jabberId}?page=${activePage}&perPage=${perPage}&status=${status}&isPaid=${isPaid}`
    );
  };

  const {
    isLoading: loadingProducts,
    data: productData,
    refetch,
    isRefetching: refetchingProducts,
  } = useQuery([`mails-${auth?.jabberId}`, activePage], fetchProducts, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(productData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, status, isPaid]);

  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setIsPaid("");
    setStatus("");
    setPerPage(20);
    setPage(1);
  };
  // todo work on pay btn 
  const [productId, setProductId] = useState("");
  
   // pay one user products 
  const payOneProduct = (data) => {
    const productType = 'mail'
    return axios.put(`sellers/one/${productId}/${productType}`, data)
  }

  const { mutate: payOneProductMutate, isLoading: loadingPayOne } = useMutation(
    payOneProduct,
    {
      onSuccess: (response) => {
        const text = response?.data?.message
        toast.success(text)
        queryClient.invalidateQueries([`mails-${auth?.jabberId}`, activePage]);
      },
      onError: (err) => {
        const text = err?.response?.data?.message || 'something went wrong'
        toast.error(text)
      },
    },
  ) 
 // pay one alert  
    const payUser = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Pay one product!</h1>
            <p className="pb-1">{`Are you sure you want to pay one product?`}</p>
            <div className="flex justify-center items-center gap-1">
              <button
                className="rounded-md  bg-gray-400 text-white w-[50%]font-bold px-5 py-1 hover:bg-tertiary "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md  bg-green-500 text-white font-bold px-5 w-[50%] py-1 hover:bg-tertiary "
                onClick={() => {
                 payOneProductMutate();
                  onClose();
                }}
              >
                Pay 
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of alert

 
  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
  return (
    <div>
      <div className="my-[2px]">
      
        <div className="flex justify-between px-1 md:px-4 ">
          <h1>Total: {productData?.data?.count || 0}</h1>
          <h1
            className="bg-primary cursor-pointer text-light py-1 px-5 rounded-md hover:bg-[#064919]  "
            onClick={resetFilters}
          >
            Reset filter
          </h1>
        </div>
        <div className="overflow-x-auto mb-3">
          <div className="my-3">
            <Pagination
              total={totalPages}
              page={activePage}
              color="green"
              onChange={setPage}
            />
          </div>
          <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Email
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Password
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Category
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Recovery Email
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Price
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {!productData?.data?.mails ||
              productData?.data?.mails?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No TextNow/Mail products
                  </td>
                </tr>
              ) : loadingProducts || refetchingProducts ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : (
                productData?.data?.mails?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.password}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.category}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.recoveryMail}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        ${formatCurrency(item?.price?.price)}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                       {
                          item.isPaid === 'Is Paid' ? 
                          <h1>Paid</h1>:

                          item.status === "Sold" && item.isPaid === "Not Paid" ?

                        <button
                          onClick={()=>{
                            setProductId(item._id);
                            payUser();
                          }}                
                          className="bg-green-500 text-white rounded-md px-3 py-1 hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Pay
                        </button>
                        :                       
                        <h1>Not sold</h1>
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

export default TextNowProducts;
