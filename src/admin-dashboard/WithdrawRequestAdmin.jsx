import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import Select from "react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mantine/core";
import { Link } from "react-router-dom";

function WithdrawRequestAdmin() {
    const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState(30);
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

  const totalPages = Math.ceil(requestsData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, userName,status]);

  //end of fetching requests------------------
   // reset filters
  const resetFilters = () => {
    setPerPage(30);
    setPage(1);
    setUserName("");
    setStatus("");

  };
  
  


  return (
    <div className="bg-light px-3 py-3">
        <h1 className="font-bold text-lg">All withdraw Requests </h1>
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
              <label htmlFor="">Status:</label>
               <Select
              options={statusOptions}
              value={status && status.label}
              onChange={(selectOption) => {
                setStatus(selectOption?.value);
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
          <h1>Total: {requestsData?.data?.count || 0}</h1>
          
        </div>
        <div className="overflow-x-auto mb-3">
          <div className="my-3 ">
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
                  Username
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Wallet
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Amount
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
              {
                 loadingRequests ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              
              ) :
              !requestsData?.data?.withdrawRequests ||
             requestsData?.data?.withdrawRequests?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No requests found!
                  </td>
                </tr>
              ) : (
               requestsData?.data?.withdrawRequests?.map((item, index) => {
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
                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.wallet}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                         ${item?.amount || '...'}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                       <p className={item?.status === "Pending" ? "text-red-500" : "text-primary"}>{item?.status}</p>  
                      </td>
                       
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                       {
                        item.status === "Processed" ?
                        <h1>Processed</h1>
                        :

                       <Link to= {`/admin-dash/seller-details/${item.userId}`} className="bg-primary text-white rounded-md px-3 py-1 hover:bg-secondary">                                               
                          Process
                       </Link>
                       }
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

export default WithdrawRequestAdmin;
