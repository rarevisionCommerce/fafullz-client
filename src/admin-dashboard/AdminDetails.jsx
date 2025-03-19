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

function AdminDetails() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  // Manager id from auth
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const qaueryClient = useQueryClient();
  const { userId } = useParams();

  //   fetching Manager info
  const getSeller = () => {
    return axios.get(`/users/account/${userId}`);
  };
  const {
    isLoading: loadingSeller,
    data: sellerData,
    refetch,
    isRefetching: refetchingSeller,
  } = useQuery([`Manager-${userId}`], getSeller, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });
  const jabberId = sellerData?.data?.jabberId;

  // end of get Manager info

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
        qaueryClient.invalidateQueries(`Manager-${userId}`);
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
        qaueryClient.invalidateQueries(`Manager-${userId}`);
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
        qaueryClient.invalidateQueries(`Manager-${userId}`);
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
      <h1 className="font-bold text-lg ">Manager Info</h1>
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
              <h1 className="text-gray-600">Jabber Id: </h1>
              <h1>{sellerData?.data?.jabberId}</h1>
            </div>
            <div className=" mr-9">
              <h1 className="text-gray-600">Manager Status: </h1>
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
            <h1 className="text-gray-600">Update Manager status: </h1>
            {loadingActivating || loadingDeactivate || loadingSuspend ? (
              <div>
                <h1 className="text-primary my-5 text-center  ">Updating...</h1>
              </div>
            ) : (
              <div className="flex  gap-4">
                {sellerData?.data?.status === "Active" ? (
                  <button
                    disabled={!auth?.roles?.includes("Admin")}
                    className="bg-red-500 w-[120px] p-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer text-center my-5 text-light shadow-lg"
                    onClick={deactivateById}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={activate}
                    disabled={!auth?.roles?.includes("Admin")}
                    className="bg-green-500 w-24 p-2 rounded-md cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed  text-center my-5 text-light shadow-lg"
                  >
                    Activate
                  </button>
                )}

                <button
                  disabled={!auth?.roles?.includes("Admin")}
                  className={
                    sellerData?.data?.status === "Suspended"
                      ? "hidden"
                      : "bg-yellow-500 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed  cursor-pointer w-24 p-2 text-center my-5 text-light shadow-lg"
                  }
                  onClick={suspend}
                >
                  Suspend
                </button>
              </div>
            )}
            <div></div>
          </div>
        </div>
      )}
      {/* end user details  */}
    </div>
  );
}

export default AdminDetails;
