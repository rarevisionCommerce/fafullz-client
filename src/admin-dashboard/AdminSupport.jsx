import React, { useState, useEffect, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mantine/core";
import { Link } from "react-router-dom";
import { Indicator } from "@mantine/core";

function Support() {
  const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState(10);
  const [activePage, setPage] = useState(1);
  const [jabberId, setJabberId] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

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
  const roleOptions = [
    {
      label: "Buyer",
      value: "Buyer",
    },
    {
      label: "Seller",
      value: "Seller",
    },
    {
      label: "All",
      value: "",
    },
  ];

  const fetchMessages = () => {
    return axios.get(
      `/support?page=${activePage}&perPage=${perPage}&userName=${userName}&jabberId=${jabberId}&role=${role}`
    );
  };

  const {
    isLoading: loadingMessags,
    data: messageData,
    refetch,
    isRefetching: refetchingMessages,
  } = useQuery([`messages-`, activePage], fetchMessages, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(messageData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, userName, jabberId, role]);

  //   //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setPerPage(20);
    setPage(1);
    setUserName("");
    setJabberId("");
    setRole("");
  };

  console.log(messageData);

  return (
    <div className="bg-light px-3 py-3">
      <h1 className="font-bold text-lg">Support Requests </h1>
      <div className="my-[20px] ">
        {/* filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:px-4 bg-gray-100 px-2 py-3">
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
            <h1>Role</h1>
            <Select
              options={roleOptions}
              value={role && role.label}
              onChange={(selectOption) => {
                setRole(selectOption?.value);
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
          <h1>Total: {messageData?.data?.count || 0}</h1>
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
                  Jabber Id
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Role
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {!messageData?.data?.messages ||
              messageData?.data?.messages?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No messages found!
                  </td>
                </tr>
              ) : loadingMessags || refetchingMessages ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : (
                messageData?.data?.messages?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={
                        item?.adminUnread > 0 ? "bg-light" : "bg-gray-200"
                      }
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {
                          item?.adminUnread > 0 ? 
                        <Indicator
                          inline
                          label={item?.adminUnread}
                          size={16}
                        >
                          {item?.userName}
                        </Indicator> 
                        : <span>{item?.userName}</span>
                        }
                        
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.jabberId}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.role}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        <Link
                          to={`/admin-dash/messages/${item?.jabberId}`}
                          className={
                            item?.adminUnread > 0
                              ? "bg-primary text-white rounded-md px-3 py-1 hover:bg-red-400"
                              : "bg-gray-300 p-1 px-3 rounded-md"
                          }
                        >
                          View
                        </Link>
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

export default Support;
