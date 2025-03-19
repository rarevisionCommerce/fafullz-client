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
  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
  const [productId, setDeleteId] = useState("");
  const queryClient = useQueryClient();

  const { auth } = useAuth();

  const fetchProducts = () => {
    return axios.get(
      `/mails/all/${auth?.jabberId}?page=${activePage}&perPage=${perPage}&status=${status}&isPaid=${isPaid}`
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
    setPerPage(30);
    setPage(1);
  };

  const statusOptions = [
    {
      label: "Available",
      value: "Available",
    },
    {
      label: "Sold",
      value: "Sold",
    },
  ];
  const isPaidOptions = [
    {
      label: "Not Paid",
      value: "Not Paid",
    },
    {
      label: "Is Paid",
      value: "Is Paid",
    },
  ];

 const perPageOptions = [
    {
      label: "30",
      value: "30",
    },
    {
      label: "50",
      value: "50",
    },
    {
      label: "100",
      value: "100",
    },
  ];


  // delete product
  const deleteProduct = () => {
    const productType = "mail";
    return axios.delete(`/sellers/delete/${productId}/${productType}`);
  };
  const { isLoading: isDeleting, mutate: deleteProductMutate } = useMutation(
    deleteProduct,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`mails-${auth?.jabberId}`]);

        refetch();
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const deleteProductById = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Delete TextNow!</h1>
            <p className="pb-1">Are you sure you want to delete this item?</p>
            <div className="flex gap-1">
              <button
                className="rounded-md  bg-gray-400 text-white w-[50%]font-bold px-5 py-1 hover:bg-tertiary "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md  bg-red-500 text-white font-bold px-5 w-[50%] py-1 hover:bg-tertiary "
                onClick={() => {
                  deleteProductMutate();
                  onClose();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of delete product
  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
  return (
    <div>
      <div className="my-[20px]">
        {/* filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-1 md:px-4">
          <div className="flex flex-col gap-">
            <h1>Status</h1>
            <Select
              options={statusOptions}
              value={status && status.label}
              onChange={(selectOption) => {
                setStatus(selectOption?.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-">
            <h1>Is Paid</h1>
            <Select
              options={isPaidOptions}
              value={isPaid && isPaid.label}
              onChange={(selectOption) => {
                setIsPaid(selectOption?.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-">
            <h1>Per Page</h1>
            <Select
              options={perPageOptions}
              value={perPage && perPage.label}
              onChange={(selectOption) => {
                setPerPage(selectOption?.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        {/* end of filters */}

        <div className="flex justify-between mt-10 px-1 md:px-4 ">
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
                        ${formatCurrency(parseFloat(item?.price?.price))}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        <button
                          disabled={item?.status === "Sold" || isDeleting}
                          onClick={() => {
                            setDeleteId(item?._id);
                            deleteProductById();
                          }}
                          className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Delete
                        </button>
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
