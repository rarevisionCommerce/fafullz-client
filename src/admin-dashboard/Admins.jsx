import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination, Select, TextInput } from "@mantine/core";
import { Text, Modal, Button, Group } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Admins(props) {
  const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState("10");
  const [activePage, setPage] = useState(1);
  const [jabberId, setJabberId] = useState("");
  const [userName, setUserName] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

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

  const totalPages = Math.ceil(adminData?.data?.count / perPage) || 1;

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, jabberId, userName]);

  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setPerPage("30");
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
  const handleDelete = () => {
    deleteusermutate();
    close();
  };
  // end of delete user

  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
  return (
    <div className="bg-gray-900 px-3 py-3 min-h-screen text-white">
      <h1 className="font-bold text-lg">All Managers </h1>
      <div className="my-[20px] ">
        {/* filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:px-4 bg-gray-800 px-2 py-3 rounded-lg">
          <div className="flex flex-col gap-">
             <TextInput
              label="UserName"
              placeholder="Search by username"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setPage(1);
              }}
              styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" } }}
            />
          </div>
          <div className="flex flex-col w-full  ">
            <TextInput
              label="Jabber ID:"
              placeholder="Search by Jabber ID"
              value={jabberId}
              onChange={(e) => {
                setJabberId(e.target.value);
                setPage(1);
              }}
              styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" } }}
            />
          </div>
          <div className="flex flex-col gap-">
             <Select
              label="Per Page"
              data={perPageOptions}
              value={perPage}
              onChange={(value) => {
                setPerPage(value);
                setPage(1);
              }}
               styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, label: { color: "#d1d5db" }, dropdown: { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }, item: { '&[data-hovered]': { backgroundColor: '#374151' }, color: 'white' } }}
            />
          </div>
        </div>
        {/* end of filters */}

        <div className="flex justify-between mt-10 px-1 md:px-4 items-center">
          <h1>Total: {adminData?.data?.count || 0}</h1>
          <Button
            variant="outline"
            color="green"
            onClick={resetFilters}
          >
            Reset filter
          </Button>
        </div>
        <div className="overflow-x-auto mb-3 mt-4">
          <div className="my-3">
            <Pagination
              total={totalPages}
              value={activePage}
              color="green"
              onChange={setPage}
            />
          </div>
          <table className="w-full text-center table-auto border-collapse border border-gray-700 text-gray-200 text-sm">
            <thead className="bg-gray-800 ">
              <tr>
                <th className="border-collapse border border-gray-700 py-2 px-3">
                  Id
                </th>
                <th className="border-collapse border border-gray-700 py-2 px-3">
                  UserName
                </th>
                <th className="border-collapse border border-gray-700 py-2 px-3">
                  Jabber ID
                </th>
                <th className="border-collapse border border-gray-700 py-2 px-3">
                  Status
                </th>

                <th className="border-collapse border border-gray-700 py-2 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-200">
              {loadingAdmins || refetchingAdmins ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !adminData?.data?.users ||
                adminData?.data?.users?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-400 text-center py-3">
                    No users found!
                  </td>
                </tr>
              ) : (
                adminData?.data?.users?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-800 hover:bg-gray-700"
                    >
                      <td className="border-collapse border-b border-gray-700 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-gray-700 py-2 px-3">
                        {item?.userName}
                      </td>
                      <td className="border-collapse border-b border-gray-700 py-2 px-3">
                        {item?.jabberId}
                      </td>
                      <td
                        className={
                          item?.status === "Active"
                            ? "text-green-500 border-collapse border-b border-gray-700 py-2 px-3"
                            : "border-collapse border-b border-gray-700 py-2 px-3 text-red-600"
                        }
                      >
                        {item?.status}
                      </td>

                      <td className="border-collapse border-b border-gray-700 py-3 px-3 flex justify-center gap-3">
                        <Link
                          to={`/admin-dash/admin-details/${item._id}`}
                        >
                            <Button size="xs" variant="filled" color="blue">Details</Button>
                        </Link>
                        <Button
                          disabled={!auth?.roles?.includes("Admin")}
                          onClick={() => {
                            setDeleteUserId(item?._id);
                            open();
                          }}
                          color="red"
                          size="xs"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal opened={opened} onClose={close} title="Delete Manager" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to delete this Manager?</Text>
        <Group position="right" mt="md">
           <Button variant="default" onClick={close}>Cancel</Button>
           <Button color="red" onClick={handleDelete} loading={isDeleting}>Delete</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default Admins;
