import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination, Select, TextInput, Button, Loader, Text } from "@mantine/core";
import { Link } from "react-router-dom";

function WithdrawRequestAdmin() {
    const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState("30");
  const [activePage, setPage] = useState(1);
    const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");


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
  const statusOptions = [
     {
      label: "All",
      value: ""
     },
     {
      label: "Pending",
      value: "Pending",
    },
    {
      label: "Processed",
      value: "Processed",
    },
  ]


  const fetchRequests = () => {
    return axios.get(
      `/withdrawals/?page=${activePage}&perPage=${perPage}&userName=${userName}&status=${status}`
    );
  };

  const {
    isLoading: loadingRequests,
    data: requestsData,
    refetch,
  } = useQuery([`request-${auth?.userId}`, activePage], fetchRequests, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(requestsData?.data?.count / Number(perPage));

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, userName,status]);

  //end of fetching requests------------------
   // reset filters
  const resetFilters = () => {
    setPerPage("30");
    setPage(1);
    setUserName("");
    setStatus("");

  };
  
  


  return (
    <div className="bg-gray-900 min-h-screen px-4 py-4">
        <h1 className="font-bold text-xl text-white mb-4">All Withdraw Requests </h1>
      <div className="my-[20px] ">
         {/* filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 rounded-lg px-4 py-4 border border-gray-700">
          <div className="flex flex-col gap-1">
              <TextInput
                label="UserName"
                labelProps={{ style: { color: "#d1d5db" } }}
                placeholder="Search username"
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
               <Select
                label="Status"
                labelProps={{ style: { color: "#d1d5db" } }}
                placeholder="Filter by Status"
                data={statusOptions}
                value={status}
                onChange={(value) => {
                    setStatus(value);
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
     

        <div className="flex justify-between mt-6 px-1 ">
          <h1 className="text-gray-300">Total: {requestsData?.data?.count || 0}</h1>
          
        </div>
        <div className="overflow-x-auto mb-3 mt-2 rounded-lg border border-gray-700">
          
          <table className="w-full text-center table-auto border-collapse border border-gray-700 text-gray-300 text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="border border-gray-700 py-3 px-3">
                  Id
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Username
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Wallet
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Amount
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Status
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Action
                </th>
               
                
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {
                 loadingRequests ? (
                 <tr>
                  <td colSpan={6} className="text-center py-10">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              
              ) :
              !requestsData?.data?.withdrawRequests ||
             requestsData?.data?.withdrawRequests?.length < 1 ? (
                <tr>
                  <td colSpan={6} className="text-gray-400 text-center py-6">
                    No requests found!
                  </td>
                </tr>
              ) : (
               requestsData?.data?.withdrawRequests?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <td className="border border-gray-700 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border border-gray-700 py-2 px-3 font-medium text-white">
                        {item?.userName}
                      </td>
                      <td className="border border-gray-700 py-2 px-3 break-all max-w-xs">
                        {item?.wallet}
                      </td>
                      <td className="border border-gray-700 py-2 px-3">
                         ${item?.amount || '...'}
                      </td>
                      <td className="border border-gray-700 py-2 px-3">
                       <p className={item?.status === "Pending" ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>{item?.status}</p>  
                      </td>
                       
                      <td className="border border-gray-700 py-3 px-3">
                       {
                        item.status === "Processed" ?
                        <span className="text-green-500 font-medium">Processed</span>
                        :

                       <Button 
                            component={Link} 
                            to={`/admin-dash/seller-details/${item.userId}`} // Assuming seller-details is the right place to process. The original link was to seller-details/${item.userId}.
                            variant="filled" 
                            color="blue"
                            size="xs"
                        >                                               
                          Process
                       </Button>
                       }
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
              color="blue"
              onChange={setPage}
               styles={{ 
                control: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151', '&[data-active]': { backgroundColor: '#2563eb' } } 
              }}
            />
        
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawRequestAdmin;
