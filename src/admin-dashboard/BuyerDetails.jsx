import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Modal, Skeleton, TextInput, NumberInput, Button, Text } from "@mantine/core";
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
  const { register, handleSubmit, reset, formState, control } = useForm();
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
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <Modal
        opened={opened}
        onClose={close}
        title="Deduct user Balance"
        centered
        overlayProps={{ opacity: 0.55, blur: 3 }}
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
      <h1 className="font-bold text-lg mb-4 ">Buyer Details</h1>
      {loadingBuyer ? (
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </div>
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-3 bg-gray-800 drop-shadow-md rounded-lg border border-gray-700 p-6 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h1 className="text-gray-400 text-sm font-medium">User Name</h1>
              <h1 className="text-white text-lg">{buyerData?.data?.userName}</h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-400 text-sm font-medium">Seller Id</h1>
              <h1 className="text-white font-mono text-sm">{buyerData?.data?.jabberId}</h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-400 text-sm font-medium">Buyer Status</h1>
              <p
                className={
                  buyerData?.data?.status === "Active"
                    ? "text-green-400 w-fit px-2 py-0.5 rounded-full bg-green-900/30 text-sm font-medium mt-1"
                    : "text-red-400 w-fit px-2 py-0.5 rounded-full bg-red-900/30 text-sm font-medium mt-1"
                }
              >
                {buyerData?.data?.status}
              </p>
            </div>
          </div>

          <div className="border-l border-gray-700 pl-6 flex flex-col justify-between">
            <div>
                 <h1 className="font-bold text-gray-200 mb-2">User Balance</h1>
                <div className="flex gap-2 justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-green-400">
                    <MdAccountBalanceWallet size={28} />
                    <h1>
                    {paymentsData?.data?.balance?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                    </h1>
                </div>
                <div className={`${!auth?.roles?.includes("Admin") && "hidden"}`}>
                    <Button
                    variant="subtle"
                    compact
                    color="blue"
                    onClick={() => {
                        open();
                    }}
                    >
                    Deduct balance
                    </Button>
                </div>
                </div>
            </div>
            
            <div className="mt-4">
              {/* send message */}
              <form action="" className="flex flex-col gap-2">
                  <TextInput
                    label="Message Buyer"
                    placeholder="Type message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={errors.message?.type === "required" && "Message is required"}
                     styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" } }}
                  />
                  
                  <Button
                    onClick={(e) => {
                        e.preventDefault();
                        submitMessage();
                    }}
                    loading={loadingMessage}
                    fullWidth
                    mt="xs"
                  >
                    Send
                  </Button>
              </form>
            </div>
          </div>

          {/* deposit form  */}
          <div
            className={`${
              !auth?.roles?.includes("Admin") && "hidden"
            } border-l border-gray-700 pl-6 `}
          >
            <h1 className="font-semibold text-gray-200 mb-2">Deposit to this user</h1>
            <form onSubmit={handleSubmit(submitDeposit)} className="flex flex-col gap-2">
                <Controller
                    name="amount"
                    control={control}
                    rules={{ required: "Amount is required" }}
                    render={({ field }) => (
                     <TextInput
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        error={errors.amount?.message}
                        {...field}
                         styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" } }}
                     />
                    )}
                />
              
              <Button
                type="submit"
                loading={loadingDeposit}
                fullWidth
                mt="xs"
                color="green"
              >
                Deposit
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* end user details  */}

      {/* user transactions */}
      <h1 className="font-bold text-lg mt-8 mb-4">
        Buyer Transactions and Orders{" "}
      </h1>

      {/*  tabs start */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 overflow-hidden">
        <Tabs defaultValue="transactions" styles={{ tab: { color: "#d1d5db", '&[data-active]': { borderColor: '#3b82f6', color: '#3b82f6' }, '&:hover': { backgroundColor: '#374151' } } }}>
          <Tabs.List>
            <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="transactions" pt="xs">
            {/* payment History  */}
            <div className="py-2">
              <h1 className="my-2 text-gray-300">
                Payments History <span className="text-xs text-gray-500">btc</span>
              </h1>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-700 text-sm text-gray-300">
                  <thead className="bg-gray-900 text-gray-200">
                    <tr>
                      <th className="border border-gray-700 py-2 px-3">
                        SNo
                      </th>
                      <th className="border border-gray-700 py-2 px-3">
                        ID/CODE
                      </th>
                      <th className="border border-gray-700 py-2 px-3">
                        Status
                      </th>
                      <th className="border border-gray-700 py-2 px-3">
                        Date
                      </th>
                      <th className="border border-gray-700 py-2 px-3">
                        OneTime wallet
                      </th>
                      <th className="border border-gray-700 py-2 px-3">
                        Coin
                      </th>
                      <th className="border border-gray-700 py-2 px-3">
                        Added to Bal.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingPayments ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                           <PulseLoader color="#6ba54a" size={10} />
                        </td>
                      </tr>
                    ) : paymentsData?.data?.message ? (
                      <tr className="hover:bg-gray-700">
                        <td
                          colSpan={7}
                          className="border border-gray-700 text-center py-2 px-1 "
                        >
                          {" "}
                          {paymentsData?.data?.message}{" "}
                        </td>
                      </tr>
                    ) : (
                      paymentsData?.data?.transaction?.map((item, index) => {
                        return (
                          <tr key={index} className="hover:bg-gray-700 odd:bg-gray-800">
                            <td className="border border-gray-700 py-2 px-1 text-center">
                              {" "}
                              {index + 1}{" "}
                            </td>
                            <td className="border border-gray-700 py-2 px-1 font-mono text-xs">
                              {" "}
                              {item?.id}{" "}
                            </td>
                            <td
                              className={`border border-gray-700 py-2 px-1 text-center ${
                                item?.status?.toLowerCase() === "confirmed" ||
                                item?.status === "Approved"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {" "}
                              {item?.status}{" "}
                            </td>
                            <td className="border border-gray-700 py-2 px-1 text-center">
                              {item?.date?.substr(0, 10)}
                            </td>
                            <td className="border border-gray-700 py-2 px-1 font-mono text-xs max-w-[150px] truncate">
                              {item?.wallet}
                            </td>
                            <td className="border border-gray-700 py-2 px-1 text-center">
                              {item?.coin}{" "}
                            </td>
                            <td className="border border-gray-700 py-2 px-1 text-center font-bold text-green-400">
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
              <h1 className="font-bold text-lg mt-3 text-white mb-4">Buyer Orders</h1>
              <MyOrders buyerId={userId} />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default BuyerDetails;
