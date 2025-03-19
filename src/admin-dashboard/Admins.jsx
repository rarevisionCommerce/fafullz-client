import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mantine/core";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Admins(props) {
  const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState(10);
  const [activePage, setPage] = useState(1);
  const [jabberId, setJabberId] = useState("");
  const [userName, setUserName] = useState("");

  const queryClient = useQueryClient();

  const { auth } = useAuth();
  const perPageOptions = [
    {
      label: "30",
      value: "30",
    },
    {
      label: "50",
      value: "50",
    },
    {
      label: "100",
      value: "100",
    },
  ];

  const fetchSellers = () => {
    return axios.get(
      `/users?page=${activePage}&perPage=${perPage}&role=Manager&userName=${userName}&jabberId=${jabberId}`
    );
  };

  const {
    isLoading: loadingAdmins,
    data: adminData,
    refetch,
    isRefetching: refetchingAdmins,
  } = useQuery([`manager-`, activePage], fetchSellers, {
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(adminData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, jabberId, userName]);

  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setPerPage(30);
    setPage(1);
    setUserName("");
    setJabberId("");
  };
  // delete user
  const [deleteUserId, setDeleteUserId] = useState("");
  const deleteUser = () => {
    return axios.delete(`/users/delete/${deleteUserId}`);
  };
  const { isLoading: isDeleting, mutate: deleteusermutate } = useMutation(
    deleteUser,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`buyers-`, activePage]);
        refetch();
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const deleteUserById = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Delete Manager!</h1>
            <p className="pb-1">
              Are you sure you want to delete this Manager?
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
                  deleteusermutate();
                  onClose();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of delete user

  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
  return (
    <div className="bg-light px-3 py-3">
      <h1 className="font-bold text-lg">All Managers </h1>
      <div className="my-[20px] ">
        {/* filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:px-4 bg-gray-100 px-2 py-3">
          <div className="flex flex-col gap-">
            <h1>UserName</h1>
            <input
              type="text"
              className="border-2 py-1 px-2   focus:border-none "
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col w-full  ">
            <label htmlFor="">Jabber ID:</label>
            <input
              type="text"
              className="border-2 py-1 px-2   focus:border-none "
              value={jabberId}
              onChange={(e) => {
                setJabberId(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-">
            <h1>Per Page</h1>
            <Select
              options={perPageOptions}
              value={perPage && perPage.label}
              onChange={(selectOption) => {
                setPerPage(selectOption?.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        {/* end of filters */}

        <div className="flex justify-between mt-10 px-1 md:px-4 ">
          <h1>Total: {adminData?.data?.count || 0}</h1>
          <h1
            className="bg-primary cursor-pointer text-light py-1 px-5 rounded-md hover:bg-[#064919]  "
            onClick={resetFilters}
          >
            Reset filter
          </h1>
        </div>
        <div className="overflow-x-auto mb-3">
          <div className="my-3">
            <Pagination
              total={totalPages}
              page={activePage}
              color="green"
              onChange={setPage}
            />
          </div>
          <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  UserName
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Jabber ID
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Status
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {loadingAdmins || refetchingAdmins ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !adminData?.data?.users ||
                adminData?.data?.users?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No users found!
                  </td>
                </tr>
              ) : (
                adminData?.data?.users?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.userName}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.jabberId}
                      </td>
                      <td
                        className={
                          item?.status === "Active"
                            ? "text-green-500 border-collapse border-b border-slate-500 py-2 px-3"
                            : "border-collapse border-b border-slate-500 py-2 px-3 text-red-600"
                        }
                      >
                        {item?.status}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3 flex justify-center gap-3">
                        <Link
                          to={`/admin-dash/admin-details/${item._id}`}
                          className="bg-primary text-white rounded-md px-3 py-1 hover:bg-secondary"
                        >
                          Details
                        </Link>
                        <button
                          disabled={!auth?.roles?.includes("Admin")}
                          onClick={() => {
                            setDeleteUserId(item?._id);
                            deleteUserById();
                          }}
                          className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Delete
                        </button>
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

export default Admins;
