import React, { useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { TiTick } from "react-icons/ti";
import PulseLoader from "react-spinners/PulseLoader";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

function Cart() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [productId, setDeleteId] = useState("");
  const queryClient = useQueryClient();

  const productMap = {
    gVoice: "GoogleVoice",
    mail: "TextNow/Mail",
    file: "File",
    dump: "Dump",
    card: "Card",
    account: "Account",
    ssn: "SSN/DOB",
  };

  function useShoppingCart() {
    return useQuery(
      [`shoppingCart-${auth?.userId}`],
      async () => {
        const { data } = await axiosPrivate.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 5000,
        // 5 seconds in milliseconds
      }
    );
  }

  const { isLoading: loadingCart, error, data: cartData } = useShoppingCart();
  const totalItems = cartData?.cart?.length || 0;

  let totalPrice =
    cartData?.cart?.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.price),
      0
    ) || 0;

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // remove product from cart
  const deleteProduct = () => {
    return axiosPrivate.delete(`/cart/${auth?.userId}/product/${productId}`);
  };
  const { isLoading: isDeleting, mutate: deleteProductMutate } = useMutation(
    deleteProduct,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);

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
            <h1 className="font-bold text-xl">Remove Item!</h1>
            <p className="pb-1">Are you sure you want to remove this item?</p>
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
                Remove
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of delete product

  // clear cart
  const clearCart = () => {
    return axiosPrivate.delete(`/cart/products/${auth?.userId}`);
  };
  const { isLoading: clearCartLoading, mutate: clearCartMutate } = useMutation(
    clearCart,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const clearAllProducts = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Remove All Items!</h1>
            <p className="pb-1">
              Are you sure you want to remove all items in the cart?
            </p>
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
                  clearCartMutate();
                  onClose();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of clear cart

  // check Out cart
  const checkout = () => {
    return axiosPrivate.post(`/orders/${auth?.userId}`);
  };
  const { isLoading: checkoutLoading, mutate: checkoutMutate } = useMutation(
    checkout,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const checkOutProducts = () => {
    confirmAlert({
      customUI: ({ onClose,  }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Confirm Checkout!</h1>
            <p className="pb-1">
              ${formatCurrency(totalPrice)} will be deducted from your account
            </p>
            <div className="flex gap-1">
              <button
                className="rounded-md  bg-gray-400 text-white w-[50%]font-bold px-5 py-1 hover:bg-tertiary "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md  bg-primary text-white font-bold px-5 w-[50%] py-1 hover:bg-secondary "
                onClick={() => {
                  checkoutMutate();
                  onClose();
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of checkout

  return (
    <div className="bg-dark3 min-h-screen">
      <div className="p-2">
        <h1 className="mt-4 text-center font-bold text-3xl text-gray-100 ">
          Cart
        </h1>

        <div className="pt-8 overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary/70 bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Product
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
              {!cartData?.cart || cartData?.cart?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-100 text-center py-3">
                    Cart is empty
                  </td>
                </tr>
              ) : (
                cartData?.cart?.map((cart, index) => {
                  return (
                    <tr
                      className="odd:bg-[#595a59] hover:bg-gray-600 text-light text-center"
                      key={index}
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        {productMap[cart?.category] || ""}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        ${formatCurrency(cart?.price)}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3 text-center">
                        <button
                          disabled={isDeleting}
                          onClick={() => {
                            setDeleteId(cart?.productId);
                            deleteProductById();
                          }}
                          className="bg-red-500 py-1 px-3 text-center rounded-md text-light hover:bg-secondary"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          className={
            !cartData?.cart || cartData?.cart?.length < 1
              ? "hidden"
              : "flex pt-8 flex-col items-end "
          }
        >
          <div className="bg-dark2 text-light px-10 py-4 ">
            <p className="text-xl">Total Items: {totalItems}</p>
            <p className="text-xl pt-4">
              Total Price: ${formatCurrency(totalPrice)}
            </p>
            <hr className="w-full border-1 my-4  border-primary" />
            <div className="flex gap-6 pt-2 items-end">
              <div
                disabled={isDeleting}
                onClick={() => {
                  clearAllProducts();
                }}
                className="flex gap-1 cursor-pointer items-center bg-red-500 py-2 px-4 text-center rounded-md text-light hover:bg-red-400"
              >
                <p>Clear </p>
                <CgShoppingCart />
              </div>

              {checkoutLoading ? (
                <p className="text-center">
                  <PulseLoader color="#6ba54a" size={9} />
                </p>
              ) : (
                <div
                  onClick={() => {
                    checkOutProducts();
                  }}
                  className="flex items-center gap-1 cursor-pointer bg-primary py-2 px-4 text-center rounded-md text-light hover:bg-secondary"
                >
                  <p>Buy </p>
                  <TiTick size={19} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
