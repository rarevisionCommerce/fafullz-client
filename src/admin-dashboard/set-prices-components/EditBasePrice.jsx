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
    <div className="bg-light py-5 px-5 h-[100%]">
      {loadingOneBase ? (
        <div className="flex justify-center  items-center">
          <PulseLoader color="#6ba54a" size={10} />
        </div>
      ) : (
        <form
          action=""
          className={
            " bg-gray-100 md:px-4 px-2 py-3 min-h-[150px] shadow-md mb-2"
          }
          onSubmit={handleSubmit(submitEditBase)}
        >
          <h1 className="font-bold text-md text-center">Edit SSN/DOB Base </h1>

          <div className="grid  grid-cols-3 place-items-center  gap-3 my-3 ">
            <div className="flex flex-col gap-2 w-full ">
              <h1>Base</h1>
              <input
                type="text"
                defaultValue={baseData?.data?.base}
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
                defaultValue={baseData?.data?.price}
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
                <div className="flex gap-4">
                  <button className="bg-primary mt-5 text-white rounded-md px-5 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300">
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditBasePrice;
