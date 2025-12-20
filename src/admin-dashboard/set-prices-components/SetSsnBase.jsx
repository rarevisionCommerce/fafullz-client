import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox, Pagination, TextInput, NumberInput, Button } from "@mantine/core";

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
      setChecked(false);
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
    <div className="bg-gray-900 px-3 py-3 rounded-lg">
      <div className="my-[20px] ">
        {/* Add base form */}
        <form
          className={
            "bg-gray-800 md:px-6 px-4 py-6 rounded-lg shadow-md mb-6 border border-gray-700"
          }
          onSubmit={handleSubmit(submitBase)}
        >
          <h1 className="font-bold text-lg text-white mb-4">Add SSN/DOB Base </h1>

          <div className="md:grid md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-2 w-full ">
                 <Controller
                    name="base"
                    control={control}
                    rules={{ required: "Base is required" }}
                    render={({ field }) => (
                     <TextInput
                        label="Base"
                        labelProps={{ style: { color: "#d1d5db" } }}
                        placeholder="Enter base name"
                        error={errors.base?.message}
                        {...field}
                         styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' } }}
                     />
                    )}
                />
            </div>
            <div className="flex flex-col gap-2 w-full ">
                <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                     <NumberInput
                        label="Price"
                        labelProps={{ style: { color: "#d1d5db" } }}
                        placeholder="Enter price"
                        min={0}
                        precision={2}
                        error={errors.price?.message}
                        {...field}
                         styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' } }}
                     />
                    )}
                />
            </div>
            <div className="flex flex-col gap-4 w-full justify-end pb-1">
              <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                label="Show Description"
                 styles={{ label: { color: "#d1d5db" } }}
              />
                
                <Button
                    type="submit"
                    loading={loadingBase}
                    fullWidth
                    color="blue"
                >
                    Add Base
                </Button>
            </div>
          </div>
        </form>
        {/* end of add base form */}

        <div className="flex  justify-start items-center gap-5  my-6 px-1 md:px-4 text-white">
          <h1 className="text-lg font-semibold">All Bases</h1>
          <h1>Total: {basesData?.data?.count || 0}</h1>
        </div>
        <div className="overflow-x-auto mb-3 rounded-lg border border-gray-700">
          <table className="w-full text-center table-auto border-collapse border border-gray-700 text-gray-300 text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="border border-gray-700 py-3 px-3">
                  Id
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Base
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Show Description
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Price
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {loadingFetchBases ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !basesData?.data?.bases ||
                basesData?.data?.bases?.length < 1 ? (
                <tr>
                  <td colSpan={5} className="text-gray-400 text-center py-6">
                    No bases found!
                  </td>
                </tr>
              ) : (
                basesData?.data?.bases?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <td className="border border-gray-700 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border border-gray-700 py-2 px-3 font-medium text-white">
                        {item?.base}
                      </td>
                      <td className="border border-gray-700 py-2 px-3">
                        {item?.showDescription ? <span className="text-green-400">YES</span> : <span className="text-gray-500">NO</span>}
                      </td>
                      <td className="border border-gray-700 py-2 px-3 text-green-400 font-bold">
                        ${item?.price}
                      </td>

                      <td className="border border-gray-700 py-3 px-3">
                        <Link to={`/admin-dash/edit-base/${item._id}`}>
                          <Button 
                            compact 
                            variant="light" 
                            color="blue"
                          >
                            Edit
                          </Button>
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
