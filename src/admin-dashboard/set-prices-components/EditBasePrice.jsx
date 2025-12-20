import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox, Pagination, TextInput, NumberInput, Button } from "@mantine/core";

import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

function EditBasePrice() {
  const axios = useAxiosPrivate();
  const { baseId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  //   fetching one base
  const getBase = () => {
    return axios.get(`/bases/one/${baseId}`);
  };
  const { isLoading: loadingOneBase, data: baseData } = useQuery(
    [`base-${baseId}`],
    getBase,
    {
      enabled: !!baseId,
    }
  );


  const [checked, setChecked] = useState(
    baseData?.data?.showDescription
  );
  
  // Sync state when data loads
  useEffect(() => {
    if (baseData?.data) {
        setChecked(baseData.data.showDescription);
    }
  }, [baseData]);

  // end..............

  // add function
  const addBase = (base) => {
    return axios.patch(`bases/${baseId}`, base);
  };

  const {
    mutate: baseMutate,
    isLoading: loadingBase,
    error,
  } = useMutation(addBase, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries([`bases-`]);
      queryClient.invalidateQueries([`base-${baseId}`]);
      navigate(-1);
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

  const submitEditBase = (data) => {
    data.showDescription = checked;
    baseMutate(data);
  };
  return (
    <div className="bg-gray-900 py-5 px-5 h-screen text-white">
      {loadingOneBase ? (
        <div className="flex justify-center  items-center mt-20">
          <PulseLoader color="#6ba54a" size={10} />
        </div>
      ) : (
        <form
          action=""
          className={
            " bg-gray-800 md:px-6 px-4 py-8 rounded-lg shadow-md mb-2 border border-gray-700 max-w-4xl mx-auto"
          }
          onSubmit={handleSubmit(submitEditBase)}
        >
          <h1 className="font-bold text-xl text-center mb-6 text-white">Edit SSN/DOB Base </h1>

          <div className="md:grid md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-2 w-full ">
                <Controller
                    name="base"
                    control={control}
                    defaultValue={baseData?.data?.base}
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
                    defaultValue={baseData?.data?.price}
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
                    Update
                </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditBasePrice;
