import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { CgLogIn } from "react-icons/cg";
import { MdEmail, MdArrowBack } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import hacker from "../assets/graphics/fafullz.jpg";
import logo from "../assets/graphics/fafullz-logo.jpg";

function Register() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);

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
      toast.success(text);
      navigate("/");
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
    data.roles = "Buyer";
    data.accountType = "rarevision";

    registerMutate(data);
  };

  return (
    <div className="bg-black flex flex-col justify-center items-center min-h-[100vh]   ">
      {/* <h1 className="text-5xl font-bold text-light p-3 mb-2">⭐ FaFullz</h1> */}
      <div className="flex gap-1 items-center mb-3">
        <img src={logo} alt="" className=" w-[] h-[50px]  " />
        <h1 className="text-5xl font-bold text-light p-3 ">Fafullz</h1>
      </div>

      {/* Login form  */}
      <div className="flex flex-col lg:flex-row border w-full md:w-[50%] ">
        <div className="w-full bg-yellow-600 p-2 ">
          <img src={hacker} alt="" className="h-[500px] w-full" />
        </div>
        <div className="min-h-[400px] w-full  bg-dark bg-opacity-80 text-start rounded-md">
          <form
            action=""
            className="px-2 md:px-4 py-2 text-darktext "
            onSubmit={handleSubmit(onSubmitting)}
          >
            <div className="flex items-center  border-b">
              <h1 className=" text-xl text-light font-semibold my-1 ">
                Create Account
              </h1>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-3 py-2 border border-light rounded-md text-light px-2">
                <h1>
                  <HiUser size={22} />
                </h1>
                <input
                  type="text"
                  placeholder="Username"
                  className="outline-none w-full bg-light bg-opacity-0"
                  {...register("userName", {
                    required: true,
                  })}
                />
              </div>
              <p className="text-red-500 text-sm">
                {errors.userName?.type === "required" && "Username is required"}
              </p>

              <div className="flex gap-3 py-2 border border-light rounded-md text-light px-2">
                <h1>
                  <MdEmail size={22} />
                </h1>
                <input
                  type="text"
                  placeholder="Email/Jabber ID"
                  className="outline-none w-full bg-light bg-opacity-0"
                  {...register("jabberId", {
                    required: true,
                  })}
                />
              </div>
              <p className="text-red-500 text-sm">
                {errors.jabberId?.type === "required" && "JabberId is required"}
              </p>

              <div className="flex gap-3 py-2 border border-light rounded-md text-light px-2">
                <h1>
                  <RiLockPasswordFill size={20} />
                </h1>
                <input
                  type={visiblePassword ? "text" : "password"}
                  placeholder="Password"
                  className="outline-none w-full bg-light bg-opacity-0 "
                  {...register("password", {
                    required: true,
                  })}
                />
                <h1>
                  {visiblePassword ? (
                    <div
                      className="px-2 cursor-pointer"
                      onClick={() => {
                        setVisiblePassword(!visiblePassword);
                      }}
                    >
                      <AiOutlineEyeInvisible />
                    </div>
                  ) : (
                    <div
                      className="px-2 cursor-pointer"
                      onClick={() => {
                        setVisiblePassword(!visiblePassword);
                      }}
                    >
                      <AiOutlineEye />
                    </div>
                  )}
                </h1>
              </div>
              <p className="text-red-500 text-sm">
                {errors.userName?.type === "required" && "Password is required"}
              </p>
            </div>
            {/* <div className="flex gap-2 my-6">
              <input type="radio" {...register("terms", { required: true })} />
              <h1>I agree to the Terms of Service and Privacy Policy</h1>
            </div>
            <p className="text-red-500 text-sm">
              {errors.terms?.type === "required" && "Agree to terms of service"}
            </p> */}
            {registerLoading ? (
              <div className="flex justify-center pt-6 items-center">
                <PulseLoader color="white" size={10} />
              </div>
            ) : (
              <div className="flex justify-center items-center mt-4  ">
                <button className="rounded-md w-full bg-primary text-white text-center py-[6px] px-[30px] hover:bg-secondary  cursor-pointer">
                  Register
                </button>
              </div>
            )}
            <div className="my-3">
              <h1>
                <p className="text-primary underline underline-offset-4 text-center hover:underline cursor-pointer ">
                  <Link to="/">Back To Login</Link>{" "}
                </p>
              </h1>
            </div>

            {/* <div className="my-6 text-center">
              <h1>
                To be a seller
                <span className="text-blue-500 hover:underline cursor-pointer ">
                  <Link to="/registerSeller">
                    {" "}
                    Create a seller Account here
                  </Link>{" "}
                </span>
              </h1>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
