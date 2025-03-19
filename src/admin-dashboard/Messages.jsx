import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { MdDeleteForever } from "react-icons/md";
import { Loader, Modal, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { format } from "timeago.js";

function Messages() {
  const axios = useAxiosPrivate();

  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const { jabberId } = useParams();
  const [messageId, setMessageId] = useState("");
  const [sent, setSent] = useState("");
  const scroll = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //get conversation......................
  function getConversation() {
    return axios.get(`/support/messages/Admin/${jabberId}`);
  }
  // querying funtion
  const {
    data: conversationData,
    isLoading: loadingConversation,
    isError: errorConversation,
  } = useQuery([`messages-${jabberId}`], getConversation, {
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
  } = useMutation(uploadMessage, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries([`messages-${jabberId}`]);

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

  // delete message function
  const deleteMessage = (message) => {
    return axios.patch("/support/delete/message", message);
  };

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    deleteMessage,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([`messages--`]);
        reset();
        close();
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

  const onDelete = () => {
    const data = {};
    data.messageId = messageId;
    data.conversationId = conversationData?.data?._id;
    deleteMutate(data);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [sent, conversationData?.data?.messages?.length]);

  return (
    <div className="bg-light ">
      <Modal opened={opened} onClose={close} title="Delete message!" centered>
        <h1>Are you sure you want to delete this message?</h1>
        <div>
          {deleteLoading ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <div className="flex justify-center py-3">
              <button
                className="bg-red-500 text-light py-1 px-4 rounded-md hover:bg-secondary "
                onClick={() => {
                  onDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </Modal>
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {conversationData?.data?.userName}
          </h1>

          <div className=" max-h-[500px] bg-chatBg border  overflow-y-auto overflow-x-auto ">
            {loadingConversation ? (
              <div className="px-2 bg-light py-3">
                <Skeleton height={50} circle mb="xl" />
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} width="70%" radius="xl" />
              </div>
            ) : (
              conversationData?.data?.messages?.map((message, index) => {
                return (
                  <div
                    className={
                      message.from === "Admin"
                        ? "m-2 py-1 bg-[#379237] px-2 rounded-md  text-white w-[70%] float-right  "
                        : "text-white float-left bg-gray-800 w-[70%] m-2  px-2 py-1 rounded-md "
                    }
                    key={index}
                    ref={scroll}
                  >
                    <div className="p-2 group flex justify-between">
                      <p>
                        {message?.message}
                        <h1 className="text-xs text-left pt-2 text-gray-300">
                          {message?.createdAt ? format(message?.createdAt) : ""}
                        </h1>
                      </p>
                      {message?.from === "Admin" && (
                        <h1
                          className=" hidden peer group-hover:inline-block p-1 cursor-pointer text-[15px] text-right"
                          onClick={() => {
                            setMessageId(message?._id);
                            open();
                          }}
                        >
                          <MdDeleteForever size={20} />
                        </h1>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={handleSubmit(submitMessage)}
            className="grid grid-cols-1 gap-6"
          >
            <div>
              <input
                value={jabberId}
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
                className="mt-1 py-2 px-3 block w-full rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

export default Messages;
