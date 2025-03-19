import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mantine/core";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Buyers() {
    const axios = useAxiosPrivate();

  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
  const [jabberId, setJabberId] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");


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


  const fetchBuyers = () => {
    return axios.get(
      `/users?page=${activePage}&perPage=${perPage}&userName=${userName}&jabberId=${jabberId}`
    );
  };

  const {
    isLoading: loadingBuyers,
    data: buyerData,
    refetch,
    isRefetching: refetchingBuyers,
  } = useQuery([`buyers-`, activePage], fetchBuyers, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(buyerData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, jabberId, userName ]);



  //end of fetching buyers------------------

  // reset filters
  const resetFilters = () => {
    setPerPage(30);
    setPage(1);
    setUserName("");
    setJabberId("");

  };

   // Deactivate Buyer
   const deactivateBuyer = () => {
    return axios.patch(`/users/update/${userId}/${"Inactive"}`);
  };

  const { isLoading: isDeactivating, mutate: deactivateMutate } = useMutation(
    deactivateBuyer,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`buyers-`]);

        refetch();
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );

  const deactivateById = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Deactivate User!</h1>
            <p className="pb-1">Are you sure you want to de-activate this user?</p>
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
                  deactivateMutate();
                  onClose();
                }}
              >
                De-Activate
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of deactivate
  
  
  
  
  // activate Buyer
   const activateBuyer = () => {
    return axios.patch(`/users/update/${userId}/${"Active"}`);
  };

  const { isLoading: isactivating, mutate: activateMutate } = useMutation(
    activateBuyer,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`buyers-`]);

        refetch();
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );

  const activateById = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Activate User!</h1>
            <p className="pb-1">Are you sure you want to Activate this user?</p>
            <div className="flex gap-1">
              <button
                className="rounded-md  bg-gray-400 text-white w-[50%]font-bold px-5 py-1 hover:bg-tertiary "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md  bg-primary text-white font-bold px-5 w-[50%] py-1 hover:bg-tertiary "
                onClick={() => {
                  activateMutate();
                  onClose();
                }}
              >
               Activate
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of deactivate

  // delete user
  const [deleteUserId,setDeleteUserId] = useState('');
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
            <h1 className="font-bold text-xl">Delete Buyer!</h1>
            <p className="pb-1">Are you sure you want to delete this Buyer?</p>
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

  


  return (
    <div className="bg-light px-3 py-3">
        <h1 className="font-bold text-lg">All Buyers </h1>
      <div className="my-[20px] ">
        {/* filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:px-4 bg-gray-100 px-2 py-3">
           <div className="flex flex-col gap-">
            <h1>UserName</h1>
              <input
                type="text"
                value={userName}
                className="border-2 py-1 px-2   focus:border-none "
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
                value={jabberId}

                className="border-2 py-1 px-2   focus:border-none "
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
          <h1>Total: {buyerData?.data?.count || 0}</h1>
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
                  Status
                </th>
               
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {
                loadingBuyers || refetchingBuyers ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) :!buyerData?.data?.users ||
              buyerData?.data?.users?.length < 1 ? 
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No users found!
                  </td>
                </tr>: (
                buyerData?.data?.users?.map((item, index) => {
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
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      <p className={item?.status === "Active" ? "text-primary" : "text-red-500" }>{item?.status}</p>
                      </td>
                      
                      <td className="border-collapse border-b border-slate-500 py-3 px-3 flex justify-center  gap-3">
                        
                        {
                          isDeactivating || isactivating ? 

                          <p  className="text-center">
                          <PulseLoader color="#6ba54a" size={9} />
                        </p>
                        : item?.status === "Active" ? 

                        <button
                         onClick={() => {
                          setUserId(item?._id);
                          deactivateById();
                        }}
                          className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Deactivate 
                        </button>  :


                        <button
                         onClick={() => {
                          setUserId(item?._id);
                          activateById();
                        }}
                          className="bg-primary text-white rounded-md px-5 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Activate 
                        </button>

                        }
                        <button
                          onClick={() => {
                            setDeleteUserId(item?._id);
                            deleteUserById();
                          }}
                          className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Delete
                        </button>
                          <Link to= {`/admin-dash/buyer-details/${item._id}`} className="bg-primary text-white rounded-md px-3 py-1 hover:bg-secondary">                                               
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

export default Buyers;
