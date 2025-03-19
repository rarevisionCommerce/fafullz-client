import React, { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { format } from "timeago.js";

function Support() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const scroll = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //get conversation......................
  function getConversation() {
    return axios.get(`/support/messages/customer/${auth?.jabberId}`);
  }
  // querying funtion
  const {
    data: conversationData,
    isLoading: loadingConversation,
    isError: errorConversation,
  } = useQuery({
    queryKey: [`messages-${auth?.jabberId}`],
    queryFn: getConversation,
    refetchInterval: 1000,
  });
  // end...................

  // upload function
  const uploadMessage = (message) => {
    return axios.post("/support", message);
  };

  const {
    mutate: messageMutate,
    isLoading: messageLoading,
    error,
  } = useMutation({
    mutationFn: uploadMessage,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries([`messages-${auth?.jabberId}`]);

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

  const submitMessage = (data) => {
    messageMutate(data);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationData?.data?.messages?.length]);

  return (
    <div className="bg-dark3 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-light mb-4">
            Chat with Support
          </h1>

          <div className=" max-h-[500px] bg-chatBg border border-gray-400 rounded-md  overflow-y-auto overflow-x-auto ">
            {conversationData?.data?.messages?.map((message, index) => {
              return (
                <div
                  className={
                    message.from === auth?.roles[0]
                      ? "m-2  bg-[#379237] p-1 rounded-br-lg rounded-bl-lg rounded-tl-lg md:round-tr-lg  text-white w-[50%] float-right  "
                      : "text-white float-left bg-gray-800 w-[50%] m-2  p-1 rounded-br-lg rounded-bl-lg rounded-tr-lg "
                  }
                  key={index}
                  ref={scroll}
                >
                  <p className="p-2">
                    <p>
                      {message?.message}
                      <h1 className="text-xs text-left pt-2 text-gray-300">
                        {message?.createdAt ? format(message?.createdAt) : ""}
                      </h1>
                    </p>{" "}
                  </p>
                  <h1 className="text-[15px] text-right"> </h1>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit(submitMessage)}
            className="grid grid-cols-1 gap-6"
          >
            <div>
              <input
                value={auth?.jabberId}
                name="email"
                {...register("jabberId", {
                  required: true,
                })}
                className="mt-1 py-2 px-3 hidden w-full rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                value={auth?.roles[0]}
                name="text"
                {...register("role", {
                  required: true,
                })}
                className="mt-1 py-2 px-3 w-full hidden rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                value={auth?.userName}
                name="text"
                {...register("userName", {
                  required: true,
                })}
                className="mt-1 py-2 px-3 w-full hidden rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                placeholder="Describe your issue here, you can alaso provide links to screenshots. DEPOSIT ISSUES SEND WALLET ADDRESS ALONG"
                id="message"
                name="message"
                rows="5"
                {...register("message", {
                  required: true,
                })}
                className="mt-1 py-2 px-3 block w-full rounded-md bg-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs">Please select state</p>
              )}
            </div>
            <div>
              {messageLoading ? (
                <div className="flex justify-center pr-6 items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary ">
                  Send
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Support;
