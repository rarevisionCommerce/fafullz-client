import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import { Select, Pagination, Table, Badge, Loader, Text, Paper, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

function WithdrawRequests() {
    const axios = useAxiosPrivate();
  const [perPage, setPerPage] = useState("30");
  const [activePage, setPage] = useState(1);
  const { auth } = useAuth();
  const perPageOptions = [
    { label: "30", value: "30" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ];

  const fetchRequests = () => {
    return axios.get(
      `/withdrawals/one/${auth?.userId}?page=${activePage}&perPage=${perPage}`
    );
  };

  const {
    isLoading: loadingRequests,
    data: requestsData,
    refetch,
  } = useQuery([`request-${auth?.userId}`, activePage, perPage], fetchRequests, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil((requestsData?.data?.count || 0) / Number(perPage));

  // pagination refetch is handled by query key dependency

  return (
    <div className="bg-gray-900 min-h-screen py-6 px-4">
       <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937', marginBottom: '20px' }}>
         <Title order={2} color="white" align="center" mb="md">All Withdraw Requests</Title>
         
         <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
             <Text color="white">Total: {requestsData?.data?.count || 0}</Text>
             <Select
                label="Per Page"
                data={perPageOptions}
                value={perPage}
                onChange={(value) => {
                    setPerPage(value);
                    setPage(1);
                }}
                styles={{
                    label: { color: "#d1d5db" },
                    input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                    item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                    dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                }}
             />
         </div>
      </Paper>

      <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
         <div className="flex justify-center mb-4">
            <Pagination
              total={totalPages}
              value={activePage}
              onChange={setPage}
              color="blue"
              styles={{
                  item: { backgroundColor: '#374151', color: '#d1d5db', '&[data-active]': { backgroundColor: '#2563eb' } }
              }}
            />
         </div>

         <div className="overflow-x-auto">
             <Table striped highlightOnHover withBorder withColumnBorders style={{ color: '#d1d5db' }}>
                <thead className="bg-gray-800 text-gray-200">
                  <tr>
                    <th>Id</th>
                    <th>Wallet</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                    {loadingRequests ? (
                        <tr>
                            <td colSpan={4} align="center" style={{ padding: '20px' }}>
                                <Loader color="blue" variant="dots" />
                            </td>
                        </tr>
                    ) : !requestsData?.data?.withdrawRequests || requestsData?.data?.withdrawRequests?.length < 1 ? (
                        <tr>
                            <td colSpan={4} align="center" style={{ color: '#9ca3af', padding: '20px' }}>
                                No requests found!
                            </td>
                        </tr>
                    ) : (
                        requestsData?.data?.withdrawRequests?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.wallet}</td>
                                <td>{`$${item?.amount}` || '...'}</td>
                                <td>
                                    <Badge color={item?.status === "Pending" ? "red" : "green"} variant="filled">
                                        {item?.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </Table>
         </div>
      </Paper>
    </div>
  );
}

export default WithdrawRequests;
