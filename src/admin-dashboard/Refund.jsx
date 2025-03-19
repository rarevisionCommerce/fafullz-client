import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { Pagination } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import PulseLoader from "react-spinners/PulseLoader";





function Refund() {
      const axios = useAxiosPrivate();
  const refund =[1,2,3,4]
  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
    const [userName, setUserName] = useState("");

  
  // get all refunds 
  const fetchRefunds = () => {
    return axios.get(
      `/refunds?page=${activePage}&perPage=${perPage}&userName=${userName}`
    );
  };

  const {
    isLoading: loadingRefunds,
    data: refundData,
    refetch,
    isRefetching: refetchingRefunds,
  } = useQuery([`refunds-`, activePage], fetchRefunds, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });
  const totalPages = Math.ceil(refundData?.data?.count / perPage);
  return (
    <div className='bg-light min-h-screen p-3'>
      <h1>Refund Requests </h1>
      <div>
         <div className="overflow-x-auto mb-3">
          <div className="my-3">
            <Pagination
              total={totalPages}
              page={1}
              color="green"
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
                  Screenshot
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  description
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Product Type
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
                loadingRefunds ?
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
                :
                !refundData?.data?.refunds ||
              refundData?.data?.refunds?.length < 1 ? 
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No refunds found!
                  </td>
                </tr>
                :
               refundData?.data?.refunds?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={item?.isRead === "read" ?" bg-light":"bg-gray-50"}
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.userName }
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.screenshotLink }
                      </td>
                      <td className={'border-collapse border-b border-slate-500 py-2 px-3'}>
                        {item?.description}
                      </td>
                      <td className={'border-collapse border-b border-slate-500 py-2 px-3'}>
                        {item?.productType}
                      </td>
                      <td className={'border-collapse border-b border-slate-500 py-2 px-3'}>
                        ${item?.amount}
                      </td>
                      <td className={!item?.status ?"text-red-500":"text-green-500 border-collapse border-b border-slate-500 py-2 px-3"}>
                        {item?.status || 'Pending'}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                       <Link to={`/admin-dash/refund-request/${item?._id}`} className={item?.isRead === 'read'  ?"bg-gray-100":"bg-primary text-light px-3 py-1 rounded-md  hover:bg-secondary"} >View</Link>
                      </td>
                      
                      
                    </tr>
                  );
                }
              )}
             
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Refund