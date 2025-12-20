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
import { Text, Modal, Button, Group } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { MultiSelect } from "@mantine/core";

function AdminDetails() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  // Manager id from auth
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const qaueryClient = useQueryClient();
  const { userId } = useParams();
  const [deactivateOpened, { open: openDeactivate, close: closeDeactivate }] = useDisclosure(false);
  const [suspendOpened, { open: openSuspend, close: closeSuspend }] = useDisclosure(false);
  const [activateOpened, { open: openActivate, close: closeActivate }] = useDisclosure(false);

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
  const handleDeactivate = () => {
    deactivateMutate();
    closeDeactivate();
  };
  // end of de-activate alert

  // suspend   user alert
  const handleSuspend = () => {
    suspendMutate();
    closeSuspend();
  };
  // end of suspend alert

  // activate  user
  const handleActivate = () => {
    activateMutate();
    closeActivate();
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
    <div className="bg-gray-900 min-h-screen px-4 text-white py-5">
      <h1 className="font-bold text-lg mb-4">Manager Info</h1>
      {loadingSeller ? (
        <div className="flex flex-col w-full md:grid md:grid-cols-3 gap-6 p-4">
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 grid md:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
             <div>
                <label className="text-sm font-medium text-gray-400">User Name:</label>
                <p className="mt-1 text-white text-lg">{sellerData?.data?.userName}</p>
             </div>
             <div>
                <label className="text-sm font-medium text-gray-400">Jabber Id:</label>
                <p className="mt-1 text-white text-lg">{sellerData?.data?.jabberId}</p>
             </div>
             <div>
                <label className="text-sm font-medium text-gray-400">Manager Status:</label>
                <p className={`mt-1 text-lg ${sellerData?.data?.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                  {sellerData?.data?.status}
                </p>
             </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <h1 className="text-gray-400 text-sm font-medium">Update Manager status:</h1>
            {loadingActivating || loadingDeactivate || loadingSuspend ? (
              <div className="flex items-center justify-center py-4">
                  <PulseLoader color="#6B7280" size={8} />
                  <span className="ml-2 text-gray-400">Updating...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sellerData?.data?.status === "Active" ? (
                  <Button
                    color="red"
                    disabled={!auth?.roles?.includes("Admin")}
                    onClick={openDeactivate}
                    fullWidth
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    color="green"
                    disabled={!auth?.roles?.includes("Admin")}
                    onClick={openActivate}
                    fullWidth
                  >
                    Activate
                  </Button>
                )}

                {sellerData?.data?.status !== "Suspended" && (
                    <Button
                    color="yellow"
                    disabled={!auth?.roles?.includes("Admin")}
                    onClick={openSuspend}
                    fullWidth
                    >
                    Suspend
                    </Button>
                )}
              </div>
            )}
            <div></div>
          </div>
        </div>
      )}
      {/* end user details  */}

      <Modal opened={deactivateOpened} onClose={closeDeactivate} title="Deactivate User" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to de-activate this user?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeDeactivate}>Cancel</Button>
          <Button color="red" onClick={handleDeactivate}>De-Activate</Button>
        </Group>
      </Modal>

      <Modal opened={suspendOpened} onClose={closeSuspend} title="Suspend User" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to suspend this user?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeSuspend}>Cancel</Button>
          <Button color="yellow" onClick={handleSuspend}>Suspend</Button>
        </Group>
      </Modal>

      <Modal opened={activateOpened} onClose={closeActivate} title="Activate User" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to activate this user?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeActivate}>Cancel</Button>
          <Button color="green" onClick={handleActivate}>Activate</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default AdminDetails;
