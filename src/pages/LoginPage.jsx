import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import hacker from "../assets/graphics/fafullz.jpg";
import logo from "../assets/graphics/fafullz-logo.jpg";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { FaTelegramPlane } from "react-icons/fa";
import { GiStarKey } from "react-icons/gi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

function LoginPage() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const toDash = location.state?.from?.pathname || "/dash";
  const toSellerDash = location.state?.from?.pathname || "/seller-dash";
  const toAdminDash = location.state?.from?.pathname || "/admin-dash";
  const [inActive, setInActive] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);

  useEffect(() => {
    loadCaptchaEnginge(8);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const login = (loginData) => {
    return axios.post("/auth", loginData);
  };

  const { mutate: loginMutate, isLoading: loginLoading, error } = useMutation(
    login,
    {
      onSuccess: (response) => {
        reset();
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        const userId = response?.data?.user_Id;
        const userName = response?.data?.userName;
        const jabberId = response?.data?.jabberId;
        const status = response?.data?.status;
        const categories = response?.data?.categories || [];

        const text = `Welcome back ${userName}` || "Welcome back";
        if (roles?.includes("Buyer")) {
          navigate(toDash, { replace: true });
        } else if (roles?.includes("Seller")) {
          navigate(toSellerDash, { replace: true });
        } else if (roles?.includes("Admin") || roles?.includes("Manager")) {
          navigate(toAdminDash, { replace: true });
        } else {
          navigate("/login");
          toast.success("Unauthorized");
        }
        toast.success(text);
        localStorage.setItem("userId", JSON.stringify(userId));
        setAuth({
          roles,
          accessToken,
          userId,
          userName,
          jabberId,
          status,
          categories,
        });
      },
      onError: (err) => {
        const text = err?.response.data.message;
        if (text === "Inactive") {
          setInActive(true);
        }
        setErrMsg(text);
        setTimeout(() => {
          setErrMsg("");
        }, 10000);
        if (!err.response.data.message) {
          toast.error("something went wrong");
        }
      },
    }
  );

  const onSubmitting = (data) => {
    data.accountType = "rarevision";

    if (validateCaptcha(captchaValue) === true) {
      loginMutate(data);
    } else {
      toast.error("Captcha Does Not Match");
      setCaptchaValue("");
    }
  };

  return (
    <div className=" bg-black flex flex-col justify-center items-center min-h-[100vh] ">
      <div className={inActive ? "" : "hidden"}>
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Inactive User"
          color="lime"
          variant="filled"
        >
          Contact admin to activate your account. Admin Jabber Id:
        </Alert>
      </div>
      <div className="flex gap-1 items-center mb-3">
        <img src={logo} alt="" className=" w-[] h-[50px]  " />
        <h1 className="text-5xl font-bold text-light p-3 ">Fafullz</h1>
      </div>
      {/* Login form  */}
      <div className="flex flex-col lg:flex-row border w-full md:w-[50%]  ">
        {/* image */}
        <div className="w-full bg-yellow-600 p-2 ">
          <img src={hacker} alt="" className="h-[500px] w-full" />
        </div>

        <div className="min-h-[400px] w-full  bg-dark bg-opacity-80 text-start rounded-md">
          <form
            onSubmit={handleSubmit(onSubmitting)}
            className="px-2 md:px-4 py-2 text-dark "
          >
            <div className="flex items-center gap-3 border-b">
              <h1 className=" text-xl text-light font-semibold my-4 ">
                Account Login
              </h1>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-red-500 text-sm text-center">{errMsg}</p>

              <div className="flex gap-3 py-2 border border-light rounded-md text-light px-2 ">
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

              <div className="flex gap-3 p-2 border border-light rounded-md text-light px-2 ">
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
                {errors.password?.type === "required" && "Password is required"}
              </p>
            </div>

            <div className="flex flex-col bg-gray-500 p-3 md:mx-14 text-light   items-center mb-4 mt-3">
              <LoadCanvasTemplate reloadColor="white" />
            </div>
            <div className="flex gap-3 pt-2 border px-2 border-light text-light py-1 rounded-md">
              <h1>
                <GiStarKey size={20} color="white" />
              </h1>
              <input
                type="text"
                className="outline-none w-full bg-light bg-opacity-0"
                placeholder="Enter Captcha Value"
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
              />
            </div>

            <div className="my-6 flex items-center justify-center ">
              {loginLoading ? (
                <div className="flex justify-center pt-6 items-center">
                  <PulseLoader color="white" size={10} />
                </div>
              ) : (
                <button className="rounded-md w-full bg-primary text-white text-center py-[6px] px-[30px] hover:bg-secondary  cursor-pointer">
                  Login
                </button>
              )}
            </div>
            <div className="my-3">
              <h1>
                <p className="text-primary underline underline-offset-4 text-center hover:underline cursor-pointer ">
                  <Link to="/register">Create an Account</Link>{" "}
                </p>
              </h1>
            </div>
          </form>
          <a className="" href="https://t.me/fafullzz" target="_blank">
            <p className="bg-blue-500 h-8  flex items-center hover:bg-blue-600 text-white font-bold py-[1px] px-4 ">
              <FaTelegramPlane className="inline-block mr-2" />
              <p className="hidden text-sm md:flex">Join Us on Telegram</p>
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
