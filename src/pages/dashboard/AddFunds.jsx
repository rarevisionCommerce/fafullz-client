import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import QrCodeGenerator from "../../components/QrCodeGenerator";
import btcIcon from "../../assets/graphics/btc.png";
import ethIcon from "../../assets/graphics/eth.png";
import liteIcon from "../../assets/graphics/lite.png";
import usdtIcon from "../../assets/graphics/usdtIcon.png";
import Select from "react-select";
import { Loader } from "@mantine/core";

function AddFunds() {
  const axios = useAxiosPrivate();
  // BUYER id from auth
  const { auth } = useAuth();
  const userId = auth?.userId;
  const userName = auth?.userName;

  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [paymentData, setPaymentData] = useState({});
  console.log(paymentData);

  // get currencies
  const getCurrencies = () => {
    return axios.get(`/payments/nowpayments/get-currencies`);
  };

  const {
    isLoading: loadingCurrencies,
    data: currenciesData,
    isRefetching: refetchingCurrencies,
  } = useQuery(["currencies"], getCurrencies, {
    keepPreviousData: true,
  });

  const formattedArray = currenciesData?.data?.selectedCurrencies.map(
    (currency) => {
      let label;
      switch (currency) {
        case "BTC":
          label = "Bitcoin - BTC";
          break;
        case "LTC":
          label = "Litecoin - LTC";
          break;
        case "USDTERC20":
          label = "USDT - ERC20";
          break;
        case "SOL":
          label = "Solana - SOL";
          break;
        default:
          label = currency; // fallback to the currency code if not matched
      }

      return { label, value: currency.toLowerCase() };
    }
  );
  // get min amount
  const getMinAmount = () => {
    return axios.get(`/payments/nowpayments/min-amount/${cryptoCurrency}`);
  };

  const {
    isLoading: loadingMinAmount,
    data: minAmountData,
    isRefetching: refetchingMinAmount,
    refetch: refetchMinAmount,
  } = useQuery(["min-amount"], getMinAmount, {
    keepPreviousData: true,
    enabled: !!cryptoCurrency,
  });

  useEffect(() => {
    if (cryptoCurrency) {
      refetchMinAmount();
    }
  }, [cryptoCurrency]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  // create payment function
  const createPaymentFnc = (payAddress) => {
    return axios.post("/payments/nowpayments/create-payment", payAddress);
  };
  const {
    mutate: createPaymentMutate,
    isLoading: loadingCreatePayment,
    error,
  } = useMutation(createPaymentFnc, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      setPaymentData(response.data?.paymentData);
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response?.data?.message) {
        toast.error("something went wrong");
      }
    },
  });
  //   fetching user payment history
  const fetchPayments = () => {
    return axios.get(`/payments/payment-history/${userId}`);
  };

  const {
    isLoading: loadingPayments,
    data: paymentsData,
    refetch,
    isRefetching: refetchingPayments,
  } = useQuery(["payments"], fetchPayments, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  //end of fetching payments------------------
  const submit = (data) => {
    if (!cryptoCurrency) {
      toast.error("Please select cryptocurrency!");
      return;
    }

    const minAmount = parseFloat(minAmountData?.data?.fiat_equivalent);
    if (parseFloat(data.amount) < minAmount) {
      toast.error(
        `Minimum amount for ${cryptoCurrency} is ${Math.ceil(minAmount)}`
      );
      return;
    }

    data.userId = userId;
    data.userName = userName;
    data.cryptoCurrency = cryptoCurrency;
    createPaymentMutate(data);
  };

  return (
    <div className="bg-[#242424] py-4 px-3 shadow-md text-light">
      <div className="py-10 bg-gr flex flex-col justify-center items-center ">
        <p className="text-center text-xl leading-[2]">
          We are using only one-time BTC/USDT/LTC address!
        </p>
        <p className="text-center text-xl leading-[2]">
          Send <span className="font-bold">only 1 transaction</span>, all
          wallets are disposable. Otherwise, you'll lose your funds.
        </p>

        <div className="my-4 px-2 flex flex-col justify-center items-center w-full ">
          <form
            onSubmit={handleSubmit(submit)}
            action=""
            className={
              "bg-[#444343] min-h-[150px] p-2 w-full md:w-[70%] rounded-md shadow-sm"
            }
          >
            <h1 className="text-center font-bold my-1 border-b border-b-[#908f8f] pb-1">
              Add Balance
            </h1>
            <div className="">
              <h1 className="font-semibold text-md my-2">
                Enter deposit amount and crypto to generate payment wallet!
              </h1>
              <h1>select Crypto to pay with:</h1>
              <div className="flex flex-col gap-1 mt-1 bg-light text-dark">
                {loadingCurrencies ? (
                  <div>
                    <Loader color="yellow" />
                  </div>
                ) : (
                  <Select
                    options={formattedArray}
                    value={cryptoCurrency && cryptoCurrency.label}
                    onChange={(selectOption) => {
                      setCryptoCurrency(selectOption?.value);
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col gap-3 mt-4 ">
                <label htmlFor="" className="text-md">
                  Amount (USD){" "}
                  {cryptoCurrency &&
                    `minimum anout for ${cryptoCurrency} is ${Math.ceil(
                      minAmountData?.data?.fiat_equivalent
                    )} USD `}
                </label>
                <input
                  type="number"
                  disabled={!cryptoCurrency}
                  title={!cryptoCurrency && "Select Crypto first"}
                  min={Math.ceil(minAmountData?.data?.fiat_equivalent)}
                  className="w-full p-2 outline-none border rounded-md focus:border bg-dark focus:border-primary disabled:cursor-not-allowed "
                  {...register("amount", {
                    required: true,
                    validate: (value) =>
                      parseFloat(value) >=
                      parseFloat(minAmountData?.data?.fiat_equivalent),
                  })}
                />
              </div>
              <p className="text-red-500 text-xs text-start my-1">
                {errors.amount?.type === "required" && "Please enter amount "}
                {errors.amount?.type === "validate" &&
                  `Minimum amount for ${cryptoCurrency} is ${Math.ceil(
                    minAmountData?.data?.fiat_equivalent
                  )}`}
              </p>

              <div className="my-4 flex justify-center  ">
                {loadingCreatePayment ? (
                  <div className="flex justify-center pr-6 items-center">
                    <Loader color="yellow" size={30} />
                  </div>
                ) : (
                  <input
                    type="submit"
                    disabled={paymentData?.order_id}
                    value="Get wallet"
                    className={
                      "disabled:cursor-not-allowed bg-primary text-light px-4 py-2 cursor-pointer hover:bg-secondary rounded-md shadow-md"
                    }
                  />
                )}
              </div>
            </div>
          </form>
        </div>
        <div
          className={
            !paymentData?.order_id
              ? "hidden"
              : "flex  flex-col justify-center py-3 items-center md:w-[70%]"
          }
        >
          <h1 className="mb-2">Deposit using below address</h1>

          <div className="w-full pt-4 bg-[#444343]  px-3 py-2 shadow-sm">
            <QrCodeGenerator data={paymentData} />
          </div>
        </div>
      </div>

      {/* payment History  */}
      <div className="my-6 ">
        <h1 className="text-xl text-light p-2">
          Payments History <span className="text-xs">btc</span>
        </h1>
        <hr />

        {/* Table */}
        <div className="flex flex-col w-full justify-center m-2 md:mx-14 md:my-14 rounded-md  overflow-x-auto">
          <table className="w-full  md:w-[90%]  rounded-md  table-auto border-collapse border border-slate-500 text-sm">
            <thead>
              <tr className="bg-slate-700">
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
                <tr className="">
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
                    <tr key={index} className="hover:bg-slate-800">
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
    </div>
  );
}

export default AddFunds;
