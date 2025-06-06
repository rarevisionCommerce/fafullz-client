import React from "react";
import { RiLockPasswordFill, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function ChangePassword() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
    <div className=" bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <RiLockPasswordFill className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-white text-xl font-semibold text-center">
              Change Password
            </h1>
            <p className="text-blue-100 text-sm text-center mt-1">
              Keep your account secure with a strong password
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <RiLockPasswordFill className="text-slate-400 text-lg" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    name="password"
                    autoComplete="off"
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="text-lg" />
                    ) : (
                      <RiEyeLine className="text-lg" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password?.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <RiLockPasswordFill className="text-slate-400 text-lg" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    autoComplete="off"
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine className="text-lg" />
                    ) : (
                      <RiEyeLine className="text-lg" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {loadingChangePass ? (
                  <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl py-3 flex justify-center items-center">
                    <PulseLoader color="#ffffff" size={8} />
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit(handlePasswordChange)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Password Security Tips:
              </h3>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Use at least 8 characters</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Add numbers and special characters</li>
                <li>• Avoid personal information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
