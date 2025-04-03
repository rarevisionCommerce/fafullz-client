import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox, Pagination } from "@mantine/core";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";

function SetSsnBase() {
  const axios = useAxiosPrivate();
  const [checked, setChecked] = useState(false);

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  // add base..............................
  // add function
  const addBase = (base) => {
    return axios.post("/bases", base);
  };

  const {
    mutate: baseMutate,
    isLoading: loadingBase,
    error,
  } = useMutation(addBase, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries([`bases-`]);
      reset();
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });
  //   end add base.........

  // fetching bases
  const fetchBases = () => {
    return axios.get(`/bases`);
  };

  const {
    isLoading: loadingFetchBases,
    data: basesData,
    refetch,
  } = useQuery([`bases-`], fetchBases, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  //end of fetching bases------------------

  const submitBase = (data) => {
    data.showDescription = checked;
    baseMutate(data);
  };

  return (
    <div className="bg-light px-3 py-3">
      <div className="my-[20px] ">
        {/* Add base form */}
        <form
          action=""
          className={
            "bg-gray-100 md:px-4 px-2 py-3 min-h-[150px] shadow-md mb-2"
          }
          onSubmit={handleSubmit(submitBase)}
        >
          <h1 className="font-bold text-md">Add SSN/DOB Base </h1>

          <div className="md:grid  md:grid-cols-3   gap-3 my-3 ">
            <div className="flex flex-col gap-2 w-full ">
              <h1>Base</h1>
              <input
                type="text"
                className="border-2 w-full py-1 px-2 outline-none  focus:border-gray-700 focus:border-[1px] "
                {...register("base", {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.base?.type === "required" && "Base is required"}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full ">
              <h1>Price</h1>
              <input
                type="number"
                min={0}
                step="any"
                className="border-2 w-full py-1 px-2 outline-none  focus:border-gray-700 focus:border-[1px] "
                {...register("price", {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.price?.type === "required" && "Price is required"}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full justify-center">
              <h1 className="pt-4"></h1>
              <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                label="Show Description"
              />
            </div>
            <div>
              {loadingBase ? (
                <div className="flex justify-center  items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <button className="bg-primary ml-6 mt-8 text-white rounded-md px-5 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300">
                  Add Base
                </button>
              )}
            </div>
          </div>
        </form>
        {/* end of add base form */}

        <div className="flex  justify-start items-center gap-5  my-6 px-1 md:px-4 ">
          <h1 className="text-lg font-semibold">All Bases</h1>
          <h1>Total: {basesData?.data?.count || 0}</h1>
        </div>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Base
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Show Description
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Price
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {loadingFetchBases ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !basesData?.data?.bases ||
                basesData?.data?.bases?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No bases found!
                  </td>
                </tr>
              ) : (
                basesData?.data?.bases?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.base}
                      </td>
                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.showDescription ? "YES" : "NO"}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.price}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        <Link to={`/admin-dash/edit-base/${item._id}`}>
                          <button className="bg-primary text-white rounded-md px-5 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300">
                            Edit
                          </button>
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

export default SetSsnBase;
