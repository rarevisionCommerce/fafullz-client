import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Skeleton } from "@mantine/core";
import { MdAccountBalanceWallet } from "react-icons/md";
import MyOrders from "../pages/dashboard/MyOrders";
import { Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DeductBuyerBalance from "./DeductBuyerBalance";
import useAuth from "../hooks/useAuth";

function BuyerDetails() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  // seller id from auth
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const qaueryClient = useQueryClient();
  const { userId } = useParams();

  //   fetching buyer info
  const getBuyer = () => {
    return axios.get(`/users/account/${userId}`);
  };
  const {
    isLoading: loadingBuyer,
    data: buyerData,
    refetch,
    isRefetching: refetchingBuyer,
  } = useQuery([`buyer-${userId}`], getBuyer, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });
  // end of get buyer info

  //   fetching user payment history
  const fetchPayments = () => {
    return axios.get(`/payments/payment-history/${userId}`);
  };

  const {
    isLoading: loadingPayments,
    data: paymentsData,
    isRefetching: refetchingPayments,
  } = useQuery([`payments-${userId}`, userId], fetchPayments, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  //end of fetching payments------------------

  // deposit function
  const deposit = (payment) => {
    return axios.post(`/payments/push/transaction`, payment);
  };

  const {
    mutate: depositMutate,
    isLoading: loadingDeposit,
    error,
  } = useMutation(deposit, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries([`payments-${userId}`]);
      reset();
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });
  //   end deposit.........

  const submitDeposit = (data) => {
    data.buyerId = userId;
    depositMutate(data);
  };

  const [message, setMessage] = useState("");
  // send message
  const sendMessage = (data) => {
    return axios.post(`/support/admin`, data);
  };

  const { mutate: messageMutate, isLoading: loadingMessage } = useMutation(
    sendMessage,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        setMessage("");
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    }
  );

  const submitMessage = () => {
    if (!message) return toast.warn("Please enter message");
    const data = {
      jabberId: buyerData?.data?.jabberId,
      role: buyerData?.data?.roles[0],
      userName: buyerData?.data?.userName,
      message: message,
    };
    messageMutate(data);
  };

  const handleCloseDeductForm = () => {
    close();
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title="Deduct user Balance"
        centered
      >
        {auth?.roles?.includes("Admin") && (
          <DeductBuyerBalance
            balance={paymentsData?.data?.balance}
            userId={userId}
            handleCloseDeductForm={handleCloseDeductForm}
          />
        )}
      </Modal>
      {/* buyer info */}
      <h1 className="font-bold text-lg mb-2 ">Buyer Details</h1>
      {loadingBuyer ? (
        <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center p-[50px] ">
          <Skeleton height={90} radius="sm" />
          <Skeleton height={90} radius="sm" />
          <Skeleton height={90} radius="sm" />
        </div>
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-3 bg-light drop-shadow-md min-h-[150px] py-3 px-2">
          <div className="flex flex-col gap-4  ">
            <div className="flex  gap-4 my-[12]">
              <h1 className="text-gray-600">User Name: </h1>
              <h1>{buyerData?.data?.userName}</h1>
            </div>
            <div className="flex  gap-4  ">
              <h1 className="text-gray-600">Seller Id: </h1>
              <h1>{buyerData?.data?.jabberId}</h1>
            </div>
            <div className="flex  gap-4  ">
              <h1 className="text-gray-600">Buyer Status: </h1>
              <p
                className={
                  buyerData?.data?.status === "Active"
                    ? "text-green-500   text-start  text-lg"
                    : "text-red-500   text-start  text-lg"
                }
              >
                {buyerData?.data?.status}
              </p>
            </div>
          </div>

          <div className="border-l pl-3 ">
            <h1 className="font-bold ">User Balance</h1>
            <div className="flex gap-2 justify-between pr-4 items-center py-3  ">
              <div>
                <MdAccountBalanceWallet size={25} />
                <h1>
                  {paymentsData?.data?.balance?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h1>
              </div>
              <div className={`${!auth?.roles?.includes("Admin") && "hidden"}`}>
                <h1
                  className="text-sm text-blue-500 underline cursor-pointer "
                  onClick={() => {
                    open();
                  }}
                >
                  Deduct balance
                </h1>
              </div>
            </div>
            <div>
              {/* send message */}
              <form action="">
                <div className="flex flex-col justify-center gap- w-full pr-3 ">
                  <h1 className="py-2">Message Buyer</h1>
                  <input
                    type="text"
                    min={0}
                    step="any"
                    className="border-2 w-full rounded-md py-[6px]  px-2 outline-none  focus:border-gray-700 focus:border-[1px] "
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.message?.type === "required" &&
                      "Message is required"}
                  </p>
                </div>
                <div>
                  {loadingMessage ? (
                    <div className="flex justify-center  items-center">
                      <PulseLoader color="#6ba54a" size={10} />
                    </div>
                  ) : (
                    <button
                      className="bg-primary  ml-7 mt-2 text-white rounded-md px-5 py-1 hover:bg-secondary  "
                      onClick={(e) => {
                        e.preventDefault();
                        submitMessage();
                      }}
                    >
                      Send
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* deposit form  */}
          <div
            className={`${
              !auth?.roles?.includes("Admin") && "hidden"
            } border-l pl-1 `}
          >
            <h1 className="font-semibold">Deposit to this user</h1>
            <form action="" onSubmit={handleSubmit(submitDeposit)}>
              <div className="flex gap-2 mt-2">
                <h1>Amount:</h1>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className="border w-full rounded-md px-2 outline-none py-1  focus:border-gray-700 focus:border-[1px] "
                  {...register("amount", {
                    required: true,
                  })}
                />
              </div>
              <p className="text-red-500 text-xs py-1">
                {errors.amount?.type === "required" && "Amount is required"}
              </p>
              <div className=" flex justify-center item-center">
                {loadingDeposit ? (
                  <div className="flex justify-center  items-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </div>
                ) : (
                  <button className="bg-primary  text-white rounded-md px-5 py-1 hover:bg-secondary">
                    Deposit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {/* end user details  */}

      {/* user transactions */}
      <h1 className="font-bold text-lg mt-3 ">
        Buyer Transactions and Orders{" "}
      </h1>

      {/*  tabs start */}
      <div className=" overflow-x-auto my-6 mx-1 md:mx-5 bg-light">
        <Tabs defaultValue="transactions">
          <Tabs.List>
            <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="transactions" pt="xs">
            {/* payment History  */}
            <div className="bg-light my-3 py-2  ">
              <h1 className="my-2 mx-2 text-dark ">
                Payments History <span className="text-xs">btc</span>
              </h1>

              {/* Table */}
              <div className="flex flex-col w-full justify-center my-2 px-2 overflow-x-auto">
                <table className="w-full    table-auto border-collapse border border-slate-500 text-sm">
                  <thead>
                    <tr className="bg-slate-200">
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        SNo
                      </th>
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        ID/CODE
                      </th>
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        Status
                      </th>
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        Date
                      </th>
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        OneTime wallet
                      </th>
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        Coin
                      </th>
                      <th className="border-collapse border border-slate-500 py-2 px-3">
                        Added to Bal.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingPayments ? (
                      <div className="flex justify-center  pr-10 py-3 items-center">
                        <PulseLoader color="#6ba54a" size={10} />
                      </div>
                    ) : paymentsData?.data?.message ? (
                      <tr className="hover:bg-slate-100">
                        <td
                          colSpan={7}
                          className="border border-slate-500 text-center py-2 px-1 "
                        >
                          {" "}
                          {paymentsData?.data?.message}{" "}
                        </td>
                      </tr>
                    ) : (
                      paymentsData?.data?.transaction?.map((item, index) => {
                        return (
                          <tr key={index} className="hover:bg-slate-100">
                            <td className="border border-slate-500 py-2 px-1 ">
                              {" "}
                              {index + 1}{" "}
                            </td>
                            <td className="border border-slate-500 py-2 px-1 ">
                              {" "}
                              {item?.id}{" "}
                            </td>
                            <td
                              className={
                                item?.status?.toLowerCase() === "confirmed" ||
                                item?.status === "Approved"
                                  ? "border border-slate-500 py-2 px-1 text-green-500"
                                  : "border border-slate-500 py-2 px-1 text-red-500"
                              }
                            >
                              {" "}
                              {item?.status}{" "}
                            </td>
                            <td className="border border-slate-500 py-2 px-1 ">
                              {item?.date?.substr(0, 10)}
                            </td>
                            <td className="border border-slate-500 py-2 px-1 ">
                              {item?.wallet}
                            </td>
                            <td className="border border-slate-500 py-2 px-1 ">
                              {item?.coin}{" "}
                            </td>
                            <td className="border border-slate-500 py-2 px-1 ">
                              {item?.amount}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="orders" pt="xs">
            {/* orders */}
            <div>
              <h1 className="font-bold text-lg mt-3 ">Buyer Orders</h1>

              <MyOrders buyerId={userId} />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default BuyerDetails;
