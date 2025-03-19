import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";


function RefundDetails() {
  const axios = useAxiosPrivate();
  const {refundId} = useParams();
  const [action, setAction] = useState("");

  // get the product
const fetchRefund = () => {
    return axios.get(
      `/refunds/${refundId}`
    );
  };

  const {
    isLoading: loadingRefund,
    data: refundData,
    refetch,
    isRefetching: refetchingRefund,
  } = useQuery(["refund"], fetchRefund, {
    keepPreviousData: true,
  });

   // approve mutate
  const approveRefund = (refund) => {
    return axios.post(`/refunds/process`, refund);
  };
  const { isLoading: approveLoading, mutate: approveMutate } = useMutation(
    approveRefund,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        refetch();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
   // decline  mutate
  const declineRefund = (refund) => {
    return axios.post(`/refunds/process`,refund);
  };
  const { isLoading: declineLoading, mutate: declineMutate } = useMutation(
    declineRefund,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        refetch();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );

   // approve refund alert
    const approveRefundAlert = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Process Refund!</h1>
            <p className="">{`Are you sure you want to approve this request?`}</p>
            <p className="pb- text-red-500">Note this action is not reversible</p>
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
                  
                   approveMutate({
                    action : "Approved",
                    refundId :refundId,
                  });
                  onClose();
                }}
              >
                Approve
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of approve alert

   // deecline refund alert
    const declineRefundAlert = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Process Refund!</h1>
            <p className="pb-1">Are you sure you want to decline this request?</p>
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
                  const data = {
                    action : "Decline",
                    refundId :refundId,

                  }
                  declineMutate(data);
                  onClose();
                }}
              >
                Decline
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of approve alert
  return (
    <div className='bg-light px-3 py-2 min-h-screen '>
        <h1 className='text-lg font-bold text-center '>Request Details </h1>
        <div>
            <div className="my-3 bg-gray-100 p-2 shadow-sm">
              <div className='flex mx-[40px] justify-evenly'>
                <div>
                 <h1 className='font-bold my-2 underline'> Refund Information </h1>
                  <div className="flex gap-2 ">
          <h1 className="font-semibold">Buyer name</h1>
          <h1>{refundData?.data?.refund?.userName}</h1>
        </div>

        <div className="flex gap-2 my-2">
          <h1 className="font-semibold">IP address:</h1>
          <h1>{refundData?.data?.refund?.ipAddress}</h1>
        </div>
        <div className="flex gap-2 my-2">
          <h1 className="font-semibold">Screenshot:</h1>
          <h1>{refundData?.data?.refund?.screenshotLink}</h1>
        </div>
        <div className="flex gap-2 my-2">
          <h1 className="font-semibold">Amount:</h1>
          <h1>{refundData?.data?.refund?.amount}</h1>
        </div>

        <div className="flex gap-2 my-2">
          <h1 className="font-semibold">Description:</h1>
          <h1>{refundData?.data?.refund?.description}</h1>
        </div>
        

                </div>
                <div>
                  <h1 className='font-bold my-2 underline'> Product Information </h1>
                  <div className="flex gap-2 my-2">
                  <h1 className="font-semibold">Email</h1>
                  <h1>{refundData?.data?.product?.email}</h1>
                </div>
                  <div className="flex gap-2 my-2">
                  <h1 className="font-semibold">Recovery Email</h1>
                  <h1>{refundData?.data?.product?.recoveryMail}</h1>
                </div>
                  <div className="flex gap-2 my-2">
                  <h1 className="font-semibold">Password</h1>
                  <h1>{refundData?.data?.product?.password}</h1>
                </div>

                </div>



              </div>

        
        <div className="flex justify-center gap-2 my-4">
            <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary "
            onClick={()=>{
              approveRefundAlert();
            }}
            >
              Approve
            </button>
            <button className="hover:bg-primary text-light py-1 px-4 rounded-md bg-secondary "
            onClick={()=>{
              declineRefundAlert();
            }}
            >
              Decline
            </button>
          </div>
      </div>
      
        </div>
    </div>
  )
}

export default RefundDetails