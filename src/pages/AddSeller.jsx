import React, { useState } from "react";
import { HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { CgLogIn } from "react-icons/cg";
import { MdEmail, MdArrowBack, MdOutlineCategory } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { MultiSelect } from "@mantine/core";
import useAuth from "../hooks/useAuth";

function AddSeller() {
  const [errMsg, setErrMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const { auth } = useAuth();

  const categoriesData = [
    { value: "ssn", label: "SSN/DOB" },
    { value: "gVoice", label: "Google Voice" },
    { value: "mail", label: "TextNow/Mail" },
    { value: "card", label: "Cards" },
    { value: "file", label: "Files" },
    { value: "account", label: "Accounts" },
    { value: "dump", label: "Dumps" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // sign......................
  // signup function
  const registerUser = (registerData) => {
    return axios.post("/users", registerData);
  };

  const {
    mutate: registerMutate,
    isLoading: registerLoading,
    error,
  } = useMutation(registerUser, {
    onSuccess: (response) => {
      reset();
      const text = response?.data?.message;
      toast.success("Seller registered successfully");
      setCategories([]);
    },
    onError: (err) => {
      const text = err?.response.data.message;
      setErrMsg(text);
      setTimeout(() => {
        setErrMsg("");
      }, 10000);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = (data) => {
    data.roles = "Seller";
    data.accountType = "rarevision";
    if (!categories || categories.length < 1) {
      return toast.warn("Select atleast one category");
    }
    data.categories = categories;

    registerMutate(data);
  };

  return (
    <div className=" flex flex-col justify-center items-center  ">
      {/* Login form  */}
      <div className="min-h-[400px] w-[93%] md:w-[400px]  bg-light bg-opacity-80 text-start rounded-md">
        <form
          action=""
          className="px-2 md:px-4 py-2 text-darktext "
          onSubmit={handleSubmit(onSubmitting)}
        >
          <h1 className=" text-2xl  font-semibold my-4 ">Register Seller</h1>
          <h1 className="text-red-500 text-center">{errMsg}</h1>
          <h1 className="mb-2">Enter Details </h1>

          <div className="flex flex-col gap-2">
            <div className="flex gap-3 py-2 border-b-2 border-b-primary">
              <h1>
                <HiUser size={22} />
              </h1>
              <input
                type="text"
                placeholder="Username"
                className="outline-none w-full bg-light bg-opacity-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!auth?.roles?.includes("Admin")}
                {...register("userName", {
                  required: true,
                })}
              />
            </div>
            <p className="text-red-500">
              {errors.userName?.type === "required" && "Username is required"}
            </p>

            <div className="flex gap-3 py-2 border-b-2 border-b-primary">
              <h1>
                <MdEmail size={22} />
              </h1>
              <input
                type="text"
                placeholder="Jabber ID"
                className="outline-none w-full bg-light bg-opacity-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!auth?.roles?.includes("Admin")}
                {...register("jabberId", {
                  required: true,
                })}
              />
            </div>
            <p className="text-red-500">
              {errors.jabberId?.type === "required" && "JabberId is required"}
            </p>

            <div className="flex gap-3 py-2 border-b-2 border-b-primary">
              <h1>
                <RiLockPasswordFill size={20} />
              </h1>
              <input
                type="password"
                placeholder="Password"
                className="outline-none w-full bg-light bg-opacity-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!auth?.roles?.includes("Admin")}
                {...register("password", {
                  required: true,
                })}
              />
            </div>
            <p className="text-red-500">
              {errors.userName?.type === "required" && "Password is required"}
            </p>
            <div className="flex flex-col gap-3 py-2 border-b-2 border-b-primary">
              <h1>Select Product category.</h1>

              <div className="flex gap-3 ">
                <h1>
                  <MdOutlineCategory size={22} />
                </h1>
                <MultiSelect
                  value={categories}
                  onChange={setCategories}
                  disabled={!auth?.roles?.includes("Admin")}
                  data={categoriesData}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {registerLoading ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <div className="my-10 flex justify-end ">
              <div className="flex items-center gap-2  bg-primary cursor-pointer text-light rounded-sm">
                <input
                  type="submit"
                  value="Register"
                  className="py-2 px-4 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!auth?.roles?.includes("Admin")}

                />
                <span className="pr-1">
                  <CgLogIn size={20} />
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddSeller;
