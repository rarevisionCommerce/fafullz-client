import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import filterOptions from "../../pages/filterOptions";
import { Link } from "react-router-dom";

function SsnUpload() {
  const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth();
  const sellerId = auth?.jabberId;
  //get all bases
  const getBases = () => {
    return axios.get(`/bases`);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ["bases-"],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );
  // making base optopns
  const baseOptions = [];

  basesData?.data?.bases?.map((base, index) => {
    baseOptions.push({
      label: base.base,
      value: base,
    });
  });
  //end...........
  const base = watch("baseData");

  //   country options
  const options = useMemo(() => countryList().getData(), []);

  // upload function
  const uploadSsn = (ssnData) => {
    return axios.post("/ssn", ssnData);
  };

  const { mutate: ssnMutate, isLoading: ssnLoading, error } = useMutation(
    uploadSsn,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message;
        toast.error(text);

        if (!err.response.data.message) {
          toast.error("something went wrong");
        }
      },
    }
  );

  const submitSsn = (data) => {
    data.base = base?.base;
    data.price = base?._id;
    ssnMutate(data);
  };

  return (
    <div>
      <form
        action=""
        className="w-full px-2  "
        onSubmit={handleSubmit(submitSsn)}
      >
        <h1 className="text-center py-4 px-2">Sell SSN/DOB</h1>

        {/* ALL inputs div */}
        <div className="flex flex-col md:grid md:grid-cols-3  gap-3  ">
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Base
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <Controller
              name="baseData"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="base"
                  options={baseOptions}
                  value={baseOptions?.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value);
                  }}
                />
              )}
            />
            {errors.base && (
              <p className="text-red-500 text-xs">Base is required</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              First Name
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("firstName", {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.firstName?.type === "required" &&
                "First name is required"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Last Name
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("lastName", {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.lastName?.type === "required" && "Last name is required"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              DOB
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="date"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("dob", { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.dob?.type === "required" && "DOB is required"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              SSN
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("ssn", { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.ssn?.type === "required" && "SSN is required"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Country
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="country"
                  options={options}
                  value={options.find((option) => option.value === field.value)}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.label);
                  }}
                />
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-xs">Please select country</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              State
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="state"
                  options={filterOptions?.state}
                  value={filterOptions?.state?.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value);
                  }}
                />
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-xs">Please select state</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              City
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("city", { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.city?.type === "required" && "City is required"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              zip
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("zip", { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.zip?.type === "required" && "Zip is required"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Address
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("address", { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.address?.type === "required" && "Address is required"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">cs</label>

            <input
              type="number"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("cs", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>

            <input
              type="email"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("email", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email Pass</label>

            <input
              type="emailPass"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("emailPass", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">FA Uname</label>

            <input
              type="text"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("faUname", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">FA Pass</label>

            <input
              type="text"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("faPass", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Backup Code</label>

            <input
              type="text"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("backupCode", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Security Q&A</label>

            <input
              type="text"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("securityQa", { required: false })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Description
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("description", { required: false })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Price
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              disabled
              value={`$${base?.price || 0}`}
              className="w-full p-1 disabled:cursor-not-allowed disabled:bg-gray-300 outline-none border focus:border-secondary"
            />
          </div>
          <div className="hidden flex-col gap-2">
            <label htmlFor="">
              sellerId
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              value={sellerId}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register("sellerId", {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.sellerId?.type === "required" && "Seller Id is required"}
            </p>
          </div>
        </div>
        {/* end of inputs div */}

        <div className="flex justify-center my-6 items-center">
          {ssnLoading ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <div className="flex gap-4">
              <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary ">
                Upload
              </button>
              or
              <Link
                to={"/seller-dash/ssn-csv-upload"}
                className="cursor-pointer underline  "
              >
                Upload CSV
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SsnUpload;
