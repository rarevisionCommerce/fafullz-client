import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Loader, Pagination } from "@mantine/core";
import countryList from "react-select-country-list";
import { CgShoppingCart } from "react-icons/cg";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

function DOB() {
  const axios = useAxiosPrivate();

  const date = new Date();
  const currentYear = date.getFullYear();

  const countryOptions = useMemo(() => countryList().getData(), []);
  const { auth } = useAuth();

  const [showFilters, setShowFilters] = useState(true);

  const [perPage, setPerPage] = useState(300);
  const [base, setBase] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country1, setCountry1] = useState("");
  const [dob, setDob] = useState("");
  const [cs, setCs] = useState("");
  const [name, setName] = useState("");
  const [activePage, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState("");
  const [paid, setIsPaid] = useState({});
  const [status, setStatus] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  const fetchFiles = () => {
    return axios.get(
      `/ssn/admin/all?page=${activePage}&perPage=${perPage}&status=${
        status?.value || ""
      }&paid=${paid?.value || ""}&sellerId=${sellerId?.value || ""}&base=${
        base?.base || ""
      }`
    );
  };

  const {
    isLoading: loadingSsns,
    data: ssnData,
    refetch,
    isRefetching: refetchinSsn,
  } = useQuery(
    ["ssns", activePage, base?.base, perPage, status, paid, sellerId],
    fetchFiles,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const totalPages = Math.ceil(ssnData?.data?.count / perPage);

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allProducts = ssnData?.data?.ssns?.map((ssn) => ssn._id);
      setSelectedOrders(new Set(allProducts));
    } else {
      setSelectedOrders(new Set());
    }
  };

  // Handle order selection
  const handleOrderSelect = (orderId, checked) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // reset filters
  const resetFilters = () => {
    setBase("");
    setStatus("");
    setSellerId("");
    setIsPaid("");
    setPage(1);
  };
  //get all bases
  const getBases = () => {
    return axios.get(`/bases`);
  };

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ["bases-"],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );
  // making base optopns
  const baseOptions = [{}];

  basesData?.data?.bases?.map((base, index) => {
    baseOptions.push({
      label: base.base,
      value: { base: base._id, showDescription: base.showDescription },
    });
  });
  //end...........

  const fetchSellers = () => {
    return axios.get(
      `/users?page=${1}&perPage=${100}&role=Seller&userName=${""}&jabberId=${""}`
    );
  };

  const { isLoading: loadingSellers, data: sellersData } = useQuery(
    [`sellers-`],
    fetchSellers,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );

  const sellerOptions = [];

  sellersData?.data?.users?.map((user, index) => {
    sellerOptions.push({
      label: user?.jabberId,
      value: user?.jabberId,
    });
  });

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Available", value: "Available" },
    { label: "Sold", value: "Sold" },
    { label: "Suspended", value: "Suspended" },
  ];

  const paidOptions = [
    { label: "Paid", value: "Is Paid" },
    { label: "Not Paid", value: "Not Paid" },
  ];

  const removeProducts = (data) => {
    return axios.post("/ssn/delete", data);
  };

  const {
    mutate: removeMutate,
    isLoading: loadingMutate,
    error,
  } = useMutation(removeProducts, {
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Success");
      queryClient.invalidateQueries([`ssns`]);

      // Clear selections
      setSelectedOrders(new Set());
      setSelectAll(false);
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  // Bulk delete selected orders
  const bulkDeleteOrders = async (permanent = false) => {
    if (selectedOrders.size === 0) {
      alert("Please select products to delete");
      return;
    }

    const confirmMessage = permanent
      ? `Are you sure you want to permanently delete ${selectedOrders.size} product(s)? This action cannot be undone. This is not partial delete`
      : `Are you sure you want to delete ${selectedOrders.size} order(s)?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const data = {
        productIds: Array.from(selectedOrders),
      };

      removeMutate(data);
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      toast.error("Failed to delete products. Please try again.");
    } finally {
    }
  };

  const downloadOrdersAsCSV = (orders) => {
    // Verify inputs
    if (!Array.isArray(orders) || orders.length === 0) {
      console.error("Orders data is empty or invalid");
      return;
    }

    // Create a copy of the orders with the excluded fields removed
    const filteredOrders = orders.map((order) => {
      const orderCopy = { ...order };
      // Remove the excluded fields
      delete orderCopy._id;
      delete orderCopy.price;
      delete orderCopy.productType;
      delete orderCopy.__v;
      delete orderCopy.createdAt;
      delete orderCopy.updatedAt;
      delete orderCopy.isDeleted;
      delete orderCopy.deletedAt;
      return orderCopy;
    });

    // Create CSV header from the keys of the first filtered order object
    const headers = Object.keys(filteredOrders[0]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    filteredOrders.forEach((order) => {
      const row = headers
        .map((header) => {
          // Format the value properly for CSV
          const value = order[header];
          // Handle special cases, null, undefined, and escape commas and quotes
          if (value === null || value === undefined) {
            return "";
          }

          // Convert to string and escape quotes by doubling them
          const stringValue = String(value).replace(/"/g, '""');

          // Wrap value in quotes if it contains commas, quotes, or newlines
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue}"`;
          }

          return stringValue;
        })
        .join(",");

      csvContent += row + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderOrderTable = (orders, title) => {
    if (orders?.length === 0) return null;

    return (
      <div className="overflow-x-auto mb-3 text-sm">
        <div className="flex items-center gap-3 justify-between">
          <h2 className="my-2 text-light pb-2">{title}</h2>
          <div className="flex gap-2 items-center py-2">
            <button
              className="text-sm bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => bulkDeleteOrders(true)}
              disabled={loadingMutate || selectedOrders.size === 0}
            >
              Delete Selected
            </button>
            <button
              className="text-sm bg-green-500 text-light px-2 py-1 rounded-md"
              onClick={() => downloadOrdersAsCSV(orders)}
            >
              Download CSV
            </button>
          </div>
        </div>

        <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
          <thead className="bg-primary/70 text-light text-sm">
            <tr>
              <th className="border-collapse border border-slate-500 py-2 px-3 ">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Base
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Name
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                DOB
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Description
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                State
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                City
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Zip
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                SSN
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Address
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Email
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Email_Pass
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                FAUname
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                FAPass
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Backup_Code
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Security_Q&A
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Seller
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Status
              </th>
              <th className="border-collapse border border-slate-500 py-2 px-3">
                Is Paid
              </th>
            </tr>
          </thead>
          <tbody className="text-dark">
            {orders?.map((item, index) => {
              const orderId = item._id;
              const isSelected = selectedOrders.has(orderId);

              return (
                <tr
                  key={orderId || index}
                  className={` text-dark text-center ${
                    isSelected ? "bg-blue-600 text-light" : ""
                  }`}
                >
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleOrderSelect(orderId, e.target.checked)
                      }
                    />
                  </td>

                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.base}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.firstName || ""} {item?.lastName || ""}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.dob?.split("T")[0]}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.description?.length > 30
                      ? item.description.substring(0, 30) + "..."
                      : item?.description}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.state}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item.city}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.zip}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.ssn}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.address}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.email}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.emailPass}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.faUname}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.faPass}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.backupCode}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.securityQa?.length > 30
                      ? item.securityQa.substring(0, 30) + "..."
                      : item?.securityQa}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.sellerId}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.status}
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    {item?.isPaid == "Is Paid" ? "Paid" : item?.isPaid}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="">
      <div className="bg-gray-50 w-full rounded-t-md flex items-center gap-2 ">
        <p className="text-dark px-2 py-3">Fullz </p>
        <p
          onClick={() => {
            setShowFilters(!showFilters);
          }}
          className="text-primary cursor-pointer"
        >
          [{showFilters ? "Hide filters" : "Show Filters"}]
        </p>
      </div>

      {showFilters && (
        <div className="bg-gray-50   rounded-b-md py-3 px-2">
          {/* filters */}
          <div className="grid md:grid-cols-4 gap-8 content-center ">
            <div className="flex flex-col w-full gap-2  ">
              <label htmlFor="" className="text-dark ">
                Seller:
              </label>
              <Select
                options={sellerOptions}
                value={sellerId}
                onChange={(selectOption) => {
                  setSellerId(selectOption);
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-2  ">
              <label htmlFor="" className="text-dark ">
                Base:
              </label>
              <Select
                options={baseOptions}
                value={base && base.label}
                onChange={(selectOption) => {
                  setBase(selectOption?.value);
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-2  ">
              <label htmlFor="" className="text-dark ">
                Status:
              </label>
              <Select
                options={statusOptions}
                value={status}
                onChange={(selectOption) => {
                  setStatus(selectOption);
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-2  ">
              <label htmlFor="" className="text-dark ">
                Is Paid:
              </label>
              <Select
                options={paidOptions}
                value={paid}
                onChange={(selectOption) => {
                  setIsPaid(selectOption);
                }}
              />
            </div>

            <div className="flex justify-between items-center ">
              <h1
                className="bg-primary   cursor-pointer text-dark py-1 px-5 rounded-md"
                onClick={resetFilters}
              >
                Reset filter
              </h1>
            </div>
          </div>
          {/* end of filters */}
        </div>
      )}
      <div className="py-3 px-3 flex justify-start mt-2">
        <Pagination
          total={totalPages || 0}
          page={activePage}
          color="yellow"
          onChange={setPage}
        />
        <div className="flex justify-center items-center ml-4 text-dark">
          <p>Showing </p>
          <select
            name=""
            value={perPage}
            id=""
            className="px-1 py-1 mx-2 rounded-md border bg-gray-50 "
            onChange={(e) => {
              setPerPage(e.target.value);
            }}
          >
            <option value={300}>300</option>
            <option value={500}>500</option>
            <option value={700}>700</option>
            <option value={3000}>3000</option>
          </select>
          <p>Per page</p>
        </div>
      </div>

      {/* table */}
      <div className="overflow-y-auto rounded-lg mt-1">
        {loadingSsns || refetchinSsn ? (
          <tr className="">
            <td colSpan={12} className="text-center pl-[50%] py-5">
              <Loader color="#ff9c33" size={25} />
            </td>
          </tr>
        ) : ssnData?.data?.message ? (
          <tr>
            <td colSpan={7} className="text-gray-800 text-center py-3">
              {ssnData?.data?.message}
            </td>
          </tr>
        ) : (
          <div>{renderOrderTable(ssnData?.data?.ssns)}</div>
        )}
        <div className="py-3 px-3 flex justify-start mt-2">
          <Pagination
            total={totalPages || 0}
            page={activePage}
            color="yellow"
            onChange={setPage}
          />
          <div className="flex justify-center items-center ml-4 text-dark">
            <p>Showing </p>
            <select
              name=""
              value={perPage}
              id=""
              className="px-1 py-1 mx-2 rounded-md border bg-gray-50 "
              onChange={(e) => {
                setPerPage(e.target.value);
              }}
            >
              <option value={300}>300</option>
              <option value={500}>500</option>
              <option value={700}>700</option>
              <option value={3000}>3000</option>
            </select>
            <p>Per page</p>
          </div>
        </div>

        {/* en of header */}
      </div>
    </div>
  );
}

export default DOB;
