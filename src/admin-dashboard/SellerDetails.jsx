import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import { Skeleton } from "@mantine/core";
import { Tabs } from "@mantine/core";
import AccountProducts from "./Productpages/AccountProducts";
import CardProducts from "./Productpages/CardProducts";
import DumpProducts from "./Productpages/DumpProducts";
import FileProducts from "./Productpages/FileProducts";
import GoogleVoiceProducts from "./Productpages/GoogleVoiceProducts";
import SsnProducts from "./Productpages/SsnProducts";
import TextNowProducts from "./Productpages/TextNowProducts";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { MultiSelect } from "@mantine/core";

function SellerDetails() {
  const axios = useAxiosPrivate();

  // seller id from auth
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const qaueryClient = useQueryClient();
  const { userId } = useParams();
  const {auth} = useAuth();

  //   fetching seller info
  const getSeller = () => {
    return axios.get(`/users/account/${userId}`);
  };
  const {
    isLoading: loadingSeller,
    data: sellerData,
    refetch,
    isRefetching: refetchingSeller,
  } = useQuery([`seller-${userId}`], getSeller, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });
  const jabberId = sellerData?.data?.jabberId;

  // end of get seller info

  //   fetching seller products analysis infor
  const fetchInfo = () => {
    return axios.get(`/sellers/${jabberId}`);
  };

  const { isLoading: loadingProduct, data: productsData } = useQuery(
    [`products-${userId}`],
    fetchInfo,
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      enabled: !!jabberId,
    }
  );

  // computing data
  const totalProducts =
    productsData?.data?.account?.totalProducts +
    productsData?.data?.card?.totalProducts +
    productsData?.data?.dump?.totalProducts +
    productsData?.data?.ssn?.totalProducts +
    productsData?.data?.gVoice?.totalProducts +
    productsData?.data?.mail?.totalProducts +
    productsData?.data?.file?.totalProducts;

  const totalSold =
    productsData?.data?.account?.soldCount +
    productsData?.data?.card?.soldCount +
    productsData?.data?.dump?.soldCount +
    productsData?.data?.ssn?.soldCount +
    productsData?.data?.gVoice?.soldCount +
    productsData?.data?.mail?.soldCount +
    productsData?.data?.file?.soldCount;

  const totalPrice =
    productsData?.data?.account?.totalPrice +
    productsData?.data?.card?.totalPrice +
    productsData?.data?.dump?.totalPrice +
    productsData?.data?.ssn?.totalPrice +
    productsData?.data?.gVoice?.totalPrice +
    productsData?.data?.mail?.totalPrice +
    productsData?.data?.file?.totalPrice;

  const sellerEarning = 0.57 * totalPrice;
  const pullzEarning = 0.43 * totalPrice;

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // activate user
  const activateUser = (data) => {
    return axios.patch(`/users/update/${userId}/Active`, data);
  };

  const { mutate: activateMutate, isLoading: loadingActivating } = useMutation(
    activateUser,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        qaueryClient.invalidateQueries(`seller-${userId}`);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    }
  );

  //end of activate user
  // Deactivate  user
  const deactivateUser = (data) => {
    return axios.patch(`/users/update/${userId}/Inactive`, data);
  };

  const { mutate: deactivateMutate, isLoading: loadingDeactivate } =
    useMutation(deactivateUser, {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        qaueryClient.invalidateQueries(`seller-${userId}`);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    });
  //end of deacxtivate user  change

  // suspend  user
  const suspendUser = (data) => {
    return axios.patch(`/users/update/${userId}/Suspended`, data);
  };

  const { mutate: suspendMutate, isLoading: loadingSuspend } = useMutation(
    suspendUser,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        qaueryClient.invalidateQueries(`seller-${userId}`);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    }
  );

  //end of suspend user  change

  // deactivate user alert
  const deactivateById = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Deactivate User!</h1>
            <p className="pb-1">
              Are you sure you want to de-activate this user?
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
                  deactivateMutate();
                  onClose();
                }}
              >
                De-Activate
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of de-activate alert

  // suspend   user alert
  const suspend = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Suspend User!</h1>
            <p className="pb-1">Are you sure you want to suspend this user?</p>
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
                  suspendMutate();
                  onClose();
                }}
              >
                Suspend
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of suspend alert

  // activate  user
  const activate = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Activate User!</h1>
            <p className="pb-1">Are you sure you want to activate this user?</p>
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
                  activateMutate();
                  onClose();
                }}
              >
                Activate
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of activate

  // pay all user products
  const payAll = (data) => {
    return axios.put(`/sellers/all/${jabberId}/?amount=${sellerEarning}`, data);
  };

  const { mutate: payAllProductsMutate, isLoading: loadingPayAll } =
    useMutation(payAll, {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        qaueryClient.invalidateQueries(`seller-${userId}`);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    });
  // pay all alert
  const payUser = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Pay All!</h1>
            <p className="pb-1">
              Are you sure you want to pay all user earnings?
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
                  payAllProductsMutate();
                  onClose();
                }}
              >
                Pay all
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of alert

  // pay one user products
  const payOneProduct = (data) => {
    return axios.put(`/sellers/all/${jabberId}`, data);
  };

  const { mutate: payOneProductMutate, isLoading: loadingPayOne } = useMutation(
    payOneProduct,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    }
  );
  // update  products categories
  const updateCategories = (data) => {
    return axios.patch(`/users/categories/${sellerData?.data?._id}`, data);
  };

  const { mutate: updateCategoryMutate, isLoading: loadingUpdateCategories } =
    useMutation(updateCategories, {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    });

  const [categories, setCategories] = useState(sellerData?.data?.categories);
  useEffect(() => {
    setCategories(sellerData?.data?.categories);
  }, [sellerData?.data?.categories]);

  const categoriesData = [
    { value: "ssn", label: "SSN/DOB" },
    { value: "gVoice", label: "Google Voice" },
    { value: "mail", label: "TextNow/Mail" },
    { value: "card", label: "Cards" },
    { value: "file", label: "Files" },
    { value: "account", label: "Accounts" },
    { value: "dump", label: "Dumps" },
  ];
  const updateCategoriesFunction = () => {
    if (!categories || categories.length < 1) {
      return toast.warn("Select atleast one category");
    }
    const data = {
      categories: categories,
    };
    updateCategoryMutate(data);
  };
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
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    }
  );

  const submitMessage = (data) => {
    data.jabberId = sellerData?.data?.jabberId;
    data.role = sellerData?.data?.roles[0];
    data.userName = sellerData?.data?.userName;
    messageMutate(data);
  };

  return (
    <div className="bg-light min-h-screen px-4 py-5">
      <h1 className="font-bold text-lg ">Seller Info</h1>
      {loadingSeller ? (
        <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-3 gap-4 md:content-center p-[50px] ">
          <Skeleton height={90} radius="sm" />
          <Skeleton height={90} radius="sm" />
          <Skeleton height={90} radius="sm" />
        </div>
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-3 bg-gray-100 drop-shadow-md min-h-[150px] py-3 px-2">
          <div className="flex flex-col gap-4  ">
            <div className="flex  gap-4 my-[12]">
              <h1 className="text-gray-600">User Name: </h1>
              <h1>{sellerData?.data?.userName}</h1>
            </div>
            <div className="flex  gap-4  ">
              <h1 className="text-gray-600">Seller Id: </h1>
              <h1>{sellerData?.data?.jabberId}</h1>
            </div>
            <div className=" mr-9">
              <h1 className="text-gray-600">Seller Status: </h1>
              <p
                className={
                  sellerData?.data?.status === "Active"
                    ? "text-green-500   text-start my-1 text-lg"
                    : "text-red-500   text-start my-1 text-lg"
                }
              >
                {sellerData?.data?.status}
              </p>
            </div>
          </div>

          <div>
            <h1 className="text-gray-600">Update seller status: </h1>
            {loadingActivating || loadingDeactivate || loadingSuspend ? (
              <div>
                <h1 className="text-primary my-5 text-center  ">Updating...</h1>
              </div>
            ) : (
              <div className="flex  gap-4">
                {sellerData?.data?.status === "Active" ? (
                  <p
                    className="bg-red-500 w-[120px] p-2 rounded-md  cursor-pointer text-center my-5 text-light shadow-lg"
                    onClick={deactivateById}
                  >
                    Deactivate
                  </p>
                ) : (
                  <p
                    onClick={activate}
                    className="bg-green-500 w-24 p-2 rounded-md cursor-pointer  text-center my-5 text-light shadow-lg"
                  >
                    Activate
                  </p>
                )}

                <p
                  className={
                    sellerData?.data?.status === "Suspended"
                      ? "hidden"
                      : "bg-yellow-500 rounded-md  cursor-pointer w-24 p-2 text-center my-5 text-light shadow-lg"
                  }
                  onClick={suspend}
                >
                  Suspend
                </p>
              </div>
            )}
            <div>
              {/* send message */}
              <form action="" onSubmit={handleSubmit(submitMessage)}>
                <div className="flex flex-col justify-center gap- w-full pr-3 ">
                  <h1>Message seller</h1>
                  <input
                    type="text"
                    min={0}
                    step="any"
                    className="border-2 w-full rounded-md py-[6px]  px-2 outline-none  focus:border-gray-700 focus:border-[1px] "
                    {...register("message", {
                      required: true,
                    })}
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
                    <button className="bg-primary  ml-7 mt-2 text-white rounded-md px-5 py-1 hover:bg-secondary  ">
                      Send
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="md:border-l md:border-secondary md:pl-4">
            <h1>Categories</h1>
            {loadingSeller ? (
              <div></div>
            ) : (
              <div>
                <MultiSelect
                  value={categories}
                  onChange={setCategories}
                  data={categoriesData}
                  className="w-full"
                />
                <div className="flex justify-center items-center">
                  {loadingUpdateCategories ? (
                    <div>
                      <h1>Updating...</h1>
                    </div>
                  ) : (
                    <button
                      onClick={updateCategoriesFunction}
                      className="bg-primary mt-3  px-4 py-1 rounded-md hover:bg-green-800 text-light "
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* end user details  */}

      {/* seller products summary  */}
      <h1 className="font-bold text-lg mt-5">Seller Products</h1>

      <div className="bg-gray-100 my-4">
        {loadingProduct ? (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-4 gap-4 md:content-center p-[50px] ">
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
          </div>
        ) : (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-5 gap-4 md:content-center p-[50px] ">
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 h ">
              <h1 className="text-lg font-semibold text-center">
                Products Uploaded
              </h1>
              <div className="text-center text-lg font-semibold my-4  ">
                {productsData.data ? totalProducts : "0"}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Total Sold Products
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                {productsData.data ? totalSold : "0"}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Seller Earnings
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                ${productsData.data ? formatCurrency(sellerEarning) : "0"}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Pullz Earnings
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                ${productsData.data ? formatCurrency(pullzEarning) : "0"}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">Pay Seller </h1>
              {loadingPayAll ? (
                <div></div>
              ) : (
                <div className="flex justify-center my-4 ">
                  <button
                    disabled={
                      sellerEarning === 0 || !auth?.roles?.includes("Admin")
                        ? true
                        : false
                    }
                    onClick={payUser}
                    title={sellerEarning === 0 ? "Seller has no earnings" : ""}
                    className="bg-primary  px-4 py-1 rounded-md hover:bg-green-800 disabled:cursor-not-allowed "
                  >
                    {" "}
                    Pay all{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* products breakdown  */}
      <div className=" overflow-x-auto my-6 mx-1 md:mx-5">
        <Tabs defaultValue="ssn">
          <Tabs.List>
            <Tabs.Tab value="ssn">SSN/DOB</Tabs.Tab>
            <Tabs.Tab value="googleVoice">Google Voice</Tabs.Tab>
            <Tabs.Tab value="textNow">TextNow/Mail</Tabs.Tab>
            <Tabs.Tab value="cards">Cards</Tabs.Tab>
            <Tabs.Tab value="files">Files</Tabs.Tab>
            <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
            <Tabs.Tab value="dumps">Dumps</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="ssn" pt="xs">
            {jabberId && <SsnProducts jabberId={jabberId} />}
          </Tabs.Panel>

          <Tabs.Panel value="googleVoice" pt="xs">
            {jabberId && <GoogleVoiceProducts jabberId={jabberId} />}
          </Tabs.Panel>

          <Tabs.Panel value="textNow" pt="xs">
            {jabberId && <TextNowProducts jabberId={jabberId} />}
          </Tabs.Panel>

          <Tabs.Panel value="cards" pt="xs">
            {jabberId && <CardProducts jabberId={jabberId} />}
          </Tabs.Panel>

          <Tabs.Panel value="files" pt="xs">
            {jabberId && <FileProducts jabberId={jabberId} />}
          </Tabs.Panel>

          <Tabs.Panel value="accounts" pt="xs">
            {jabberId && <AccountProducts jabberId={jabberId} />}
          </Tabs.Panel>

          <Tabs.Panel value="dumps" pt="xs">
            {jabberId && <DumpProducts jabberId={jabberId} />}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default SellerDetails;
