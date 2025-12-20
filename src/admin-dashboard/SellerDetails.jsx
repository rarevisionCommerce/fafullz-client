import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import { Skeleton, Textarea } from "@mantine/core";
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
import { useForm, Controller } from "react-hook-form";
import { Text, Modal, Button, Group } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { MultiSelect } from "@mantine/core";

function SellerDetails() {
  const axios = useAxiosPrivate();
  const { register, handleSubmit, reset, formState, control } = useForm();
  const { errors } = formState;
  const qaueryClient = useQueryClient();
  const { userId } = useParams();
  const { auth } = useAuth();
  
  const [activeOpened, { open: openActivate, close: closeActivate }] = useDisclosure(false);
  const [deactivateOpened, { open: openDeactivate, close: closeDeactivate }] = useDisclosure(false);
  const [suspendOpened, { open: openSuspend, close: closeSuspend }] = useDisclosure(false);
  const [payAllOpened, { open: openPayAll, close: closePayAll }] = useDisclosure(false);

  // Fetching seller info
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

  // Fetching seller products analysis info
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

  // Computing data
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

  // Activate user
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

  // Deactivate user
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

  // Suspend user
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

  // Confirmation dialogs
  const handleActivate = () => {
    activateMutate();
    closeActivate();
  }
  const handleDeactivate = () => {
    deactivateMutate();
    closeDeactivate();
  }
  const handleSuspend = () => {
    suspendMutate();
    closeSuspend();
  }
  const handlePayAll = () => {
    payAllProductsMutate();
    closePayAll();
  }

  // Pay all user products
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

  // Pay one user products
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

  // Update products categories
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

  // Send message
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

  const changePassword = (data) => {
    return axios.patch(`/users/${userId}`, data);
  };

  const { mutate: changePassMutate, isLoading: loadingChangePass } =
    useMutation(changePassword, {
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

  const handlePasswordChange = () => {
    const data = { password: "123456q", type: "reset" };
    changePassMutate(data);
  };

  const updateSellerProductStatus = (data) => {
    return axios.post(`/ssn/update/seller`, data);
  };

  const { mutate: updateProductStatusMutate, isLoading: loadingProductStatus } =
    useMutation(updateSellerProductStatus, {
      onSuccess: (response) => {
        qaueryClient.invalidateQueries(`seller-${userId}`);
        const text = response?.data?.message;
        toast.success(text);
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    });

  const handleUpdateSellerProductStatus = () => {
    const data = {
      sellerId: sellerData?.data?.jabberId,
      status:
        sellerData?.data?.productStatus == "Available"
          ? "Suspended"
          : "Available",
    };
    updateProductStatusMutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className=" px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Seller Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage seller information and products
          </p>
        </div>

        {/* Seller Information Card */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Seller Information
            </h2>
          </div>

          {loadingSeller ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton height={120} radius="md" />
              <Skeleton height={120} radius="md" />
              <Skeleton height={120} radius="md" />
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Username
                  </label>
                  <p className="mt-1 text-white">
                    {sellerData?.data?.userName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Seller ID
                  </label>
                  <p className="mt-1 text-white font-mono text-sm">
                    {sellerData?.data?.jabberId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sellerData?.data?.status === "Active"
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {sellerData?.data?.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                   Product Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sellerData?.data?.productStatus === "Available"
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {sellerData?.data?.productStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={loadingChangePass}
                    loading={loadingChangePass}
                    variant="filled"
                    color="gray"
                    fullWidth
                  >
                     Reset Password
                  </Button>

                  <Button
                    onClick={handleUpdateSellerProductStatus}
                    disabled={loadingProductStatus}
                    loading={loadingProductStatus}
                    color={sellerData?.data?.productStatus == "Available" ? "red" : "blue"}
                    fullWidth
                  >
                    {sellerData?.data?.productStatus == "Available"
                      ? "Suspend Products"
                      : "Activate Products"}
                  </Button>
                </div>
              </div>

              {/* Status Management */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Status Management
                  </label>
                </div>

                {loadingActivating || loadingDeactivate || loadingSuspend ? (
                  <div className="flex items-center justify-center py-8">
                    <PulseLoader color="#6B7280" size={8} />
                    <span className="ml-2 text-gray-400">
                      Updating status...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sellerData?.data?.status === "Active" ? (
                      <Button
                        color="red"
                        fullWidth
                        onClick={openDeactivate}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        onClick={openActivate}
                        color="green"
                        fullWidth
                      >
                        Activate
                      </Button>
                    )}

                    {sellerData?.data?.status !== "Suspended" && (
                      <Button
                        color="yellow"
                        fullWidth
                        onClick={openSuspend}
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                )}

                {/* Message Form */}
                <div className="pt-4">
                  <form
                    onSubmit={handleSubmit(submitMessage)}
                    className="space-y-3"
                  >
                    <div>
                      <Controller
                        name="message"
                        control={control}
                        rules={{ required: "Message is required" }}
                        render={({ field }) => (
                          <Textarea
                            label="Send Message"
                            placeholder="Type your message..."
                            minRows={3}
                            error={errors.message?.message}
                            {...field}
                             styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" } }}
                          />
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loadingMessage}
                      loading={loadingMessage}
                      fullWidth
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Product Categories
                  </label>
                </div>

                {loadingSeller ? (
                  <Skeleton height={80} radius="md" />
                ) : (
                  <div className="space-y-3">
                    <MultiSelect
                      value={categories}
                      onChange={setCategories}
                      data={categoriesData}
                      placeholder="Select categories"
                      className="w-full"
                      styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" }, dropdown: { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }, item: { '&[data-hovered]': { backgroundColor: '#374151' }, color: 'white' } }}
                    />

                    <Button
                      onClick={updateCategoriesFunction}
                      disabled={loadingUpdateCategories}
                      loading={loadingUpdateCategories}
                      color="green"
                      fullWidth
                    >
                      Update Categories
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Analytics Cards */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">
                Sales Analytics
              </h2>
            </div>

            {loadingProduct ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height={120} radius="md" />
                ))}
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {productsData.data ? totalProducts : "0"}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Products Uploaded
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {productsData.data ? totalSold : "0"}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">Total Sold</div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ${productsData.data ? formatCurrency(sellerEarning) : "0"}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Seller Earnings
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    ${productsData.data ? formatCurrency(pullzEarning) : "0"}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Platform Earnings
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <Button
                    disabled={
                      sellerEarning === 0 || !auth?.roles?.includes("Admin")
                    }
                    onClick={openPayAll}
                    title={sellerEarning === 0 ? "Seller has no earnings" : ""}
                    loading={loadingPayAll}
                    color="green"
                    fullWidth
                  >
                      Pay All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Breakdown */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Product Categories
            </h2>
          </div>

          <div className="p-6">
            <Tabs defaultValue="ssn" styles={{ tab: { color: "#d1d5db", '&[data-active]': { borderColor: '#3b82f6', color: '#3b82f6' }, '&:hover': { backgroundColor: '#374151' } } }}>
              <Tabs.List>
                <Tabs.Tab value="ssn">SSN/DOB</Tabs.Tab>
                <Tabs.Tab value="googleVoice">Google Voice</Tabs.Tab>
                <Tabs.Tab value="textNow">TextNow/Mail</Tabs.Tab>
                <Tabs.Tab value="cards">Cards</Tabs.Tab>
                <Tabs.Tab value="files">Files</Tabs.Tab>
                <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
                <Tabs.Tab value="dumps">Dumps</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="ssn" pt="md">
                {jabberId && <SsnProducts jabberId={jabberId} />}
              </Tabs.Panel>

              <Tabs.Panel value="googleVoice" pt="md">
                {jabberId && <GoogleVoiceProducts jabberId={jabberId} />}
              </Tabs.Panel>

              <Tabs.Panel value="textNow" pt="md">
                {jabberId && <TextNowProducts jabberId={jabberId} />}
              </Tabs.Panel>

              <Tabs.Panel value="cards" pt="md">
                {jabberId && <CardProducts jabberId={jabberId} />}
              </Tabs.Panel>

              <Tabs.Panel value="files" pt="md">
                {jabberId && <FileProducts jabberId={jabberId} />}
              </Tabs.Panel>

              <Tabs.Panel value="accounts" pt="md">
                {jabberId && <AccountProducts jabberId={jabberId} />}
              </Tabs.Panel>

              <Tabs.Panel value="dumps" pt="md">
                {jabberId && <DumpProducts jabberId={jabberId} />}
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Modal opened={deactivateOpened} onClose={closeDeactivate} title="Deactivate User" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to deactivate this user?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeDeactivate}>Cancel</Button>
          <Button color="red" onClick={handleDeactivate}>Deactivate</Button>
        </Group>
      </Modal>

      <Modal opened={activeOpened} onClose={closeActivate} title="Activate User" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to activate this user?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeActivate}>Cancel</Button>
          <Button color="green" onClick={handleActivate}>Activate</Button>
        </Group>
      </Modal>

      <Modal opened={suspendOpened} onClose={closeSuspend} title="Suspend User" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to suspend this user?</Text>
        <Group position="right" mt="md">
           <Button variant="default" onClick={closeSuspend}>Cancel</Button>
           <Button color="yellow" onClick={handleSuspend}>Suspend</Button>
        </Group>
      </Modal>

      <Modal opened={payAllOpened} onClose={closePayAll} title="Pay Seller" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to pay all seller earnings?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closePayAll}>Cancel</Button>
          <Button color="green" onClick={handlePayAll}>Pay All</Button>
        </Group>
      </Modal>

    </div>
  );
}

export default SellerDetails;
