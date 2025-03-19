import React from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function ChangePassword() {
    const axios = useAxiosPrivate();
  const { auth } = useAuth();
  // password change
  // password form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const changePassword = (data) => {
    return axios.patch(`/users/${auth?.userId}`, data);
  };

  const { mutate: changePassMutate, isLoading: loadingChangePass } =
    useMutation(changePassword, {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.error(text);
      },
    });

  const handlePasswordChange = (data) => {
    changePassMutate(data);
  };

  //end of password change
  return (
    <div className=" py-4 px-2 flex justify-center">
      <div className="bg-dark3 text-light bg-opacity-70 px-1 md:px-4  md:w-[50%] shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h1 className="my-3 border-b border-b-gray-400 ">Change Password</h1>
          <div className="flex flex-col gap-6 mt-6">
            <div className="flex gap-3 p-2 border rounded-md">
              <h1>
                <RiLockPasswordFill size={20} />
              </h1>
              <input
                type="password"
                {...register("password")}
                name="password"
                autoComplete="off"
                placeholder="Enter New Password"
                className="outline-none w-full bg-light bg-opacity-0 "
              />
            </div>
            <p className="text-red-500">{errors.password?.message}</p>
            <div className="flex gap-3 p-2 border rounded-md">
              <h1>
                <RiLockPasswordFill size={20} />
              </h1>
              <input
                type="password"
                {...register("confirmPassword")}
                autoComplete="off"
                placeholder="Repeat New Password"
                className="outline-none w-full bg-light bg-opacity-0 "
              />
            </div>
            <p className="text-red-500">{errors.confirmPassword?.message}</p>
            <div className="my-5 flex justify-center">
              {loadingChangePass ? (
                <div className="flex justify-center py-4 pr-6 items-center">
                  <p  className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSubmit(handlePasswordChange)}
                  className="bg-primary text-light py-1 px-5 rounded-md hover:bg-[#064919]  "
                >
                  Change password
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
