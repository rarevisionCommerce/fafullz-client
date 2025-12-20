import React, { useState, useEffect, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination, Select, TextInput, Button, Loader, Indicator, Text } from "@mantine/core";
import { Link } from "react-router-dom";

function Support() {
  const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState("10");
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
      label: "All",
      value: "",
    },
    {
      label: "Buyer",
      value: "Buyer",
    },
    {
      label: "Seller",
      value: "Seller",
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

  const totalPages = Math.ceil(messageData?.data?.count / Number(perPage));

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, userName, jabberId, role]);

  //   //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setPerPage("20");
    setPage(1);
    setUserName("");
    setJabberId("");
    setRole("");
  };

  return (
    <div className="bg-gray-900 min-h-screen px-4 py-4">
      <h1 className="font-bold text-xl text-white mb-4">Support Requests </h1>
      <div className="my-[20px] ">
        {/* filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-800 rounded-lg px-4 py-4 border border-gray-700">
          <div className="flex flex-col gap-1">
            <TextInput
                label="UserName"
                labelProps={{ style: { color: "#d1d5db" } }}
                placeholder="Search Username"
                value={userName}
                onChange={(e) => {
                    setUserName(e.target.value);
                    setPage(1);
                }}
                 styles={{ 
                    input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                }}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
             <TextInput
                label="Jabber ID"
                labelProps={{ style: { color: "#d1d5db" } }}
                placeholder="Search Jabber ID"
                value={jabberId}
                onChange={(e) => {
                    setJabberId(e.target.value);
                    setPage(1);
                }}
                 styles={{ 
                    input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Select
              label="Role"
              labelProps={{ style: { color: "#d1d5db" } }}
              placeholder="Filter by Role"
              data={roleOptions}
              value={role}
              onChange={(value) => {
                setRole(value);
                setPage(1);
              }}
               styles={{ 
                    input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' },
                    item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                    dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Select
              label="Per Page"
              labelProps={{ style: { color: "#d1d5db" } }}
              placeholder="Per Page"
              data={perPageOptions}
              value={perPage}
              onChange={(value) => {
                setPerPage(value);
                setPage(1);
              }}
               styles={{ 
                    input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' },
                    item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                    dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                }}
            />
          </div>
        </div>
        {/* end of filters */}

        <div className="flex justify-between items-center mt-6 px-1">
          <h1 className="text-gray-300">Total: {messageData?.data?.count || 0}</h1>
          <Button onClick={resetFilters} color="green" variant="light">
            Reset filter
          </Button>
        </div>
        <div className="overflow-x-auto mb-3 mt-2 rounded-lg border border-gray-700">
         
          <table className="w-full text-center table-auto border-collapse border border-gray-700 text-gray-300 text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="border border-gray-700 py-3 px-3">
                  Id
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  UserName
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Jabber Id
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Role
                </th>

                <th className="border border-gray-700 py-3 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {!messageData?.data?.messages ||
              messageData?.data?.messages?.length < 1 ? (
                <tr>
                  <td colSpan={5} className="text-gray-400 text-center py-6">
                    No messages found!
                  </td>
                </tr>
              ) : loadingMessags || refetchingMessages ? (
                 <tr>
                  <td colSpan={5} className="text-center py-10">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : (
                messageData?.data?.messages?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={`transition-colors border-b border-gray-700 ${
                        item?.adminUnread > 0 ? "bg-blue-900/40 hover:bg-blue-900/60" : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      <td className="py-2 px-3 border border-gray-700">
                        {index + 1}
                      </td>

                      <td className="py-2 px-3 border border-gray-700">
                        {
                          item?.adminUnread > 0 ? 
                        <Indicator
                          inline
                          label={item?.adminUnread}
                          size={16}
                          color="red"
                          offset={-5}
                        >
                          <Text color="white" weight={500}>{item?.userName}</Text>
                        </Indicator> 
                        : <span>{item?.userName}</span>
                        }
                        
                      </td>
                      <td className="py-2 px-3 border border-gray-700">
                        {item?.jabberId}
                      </td>
                      <td className="py-2 px-3 border border-gray-700">
                        {item?.role}
                      </td>

                      <td className="py-3 px-3 border border-gray-700">
                        <Button
                          component={Link}
                          to={`/admin-dash/messages/${item?.jabberId}`}
                          variant={item?.adminUnread > 0 ? "filled" : "light"}
                          color={item?.adminUnread > 0 ? "blue" : "gray"}
                          size="xs"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
           <div className="my-4 flex justify-center">
            <Pagination
              total={totalPages || 0}
              value={activePage}
              color="green"
              onChange={setPage}
               styles={{ 
                control: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151', '&[data-active]': { backgroundColor: '#2f9e44' } } 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
