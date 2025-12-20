import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { MdDeleteForever } from "react-icons/md";
import { Loader, Modal, Skeleton, Textarea, Button, Text, Group } from "@mantine/core";
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
    control
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
    <div className="bg-gray-900 min-h-screen">
      <Modal opened={opened} onClose={close} title="Delete message!" centered overlayProps={{ opacity: 0.55, blur: 3 }}>
        <Text size="sm">Are you sure you want to delete this message?</Text>
        <Group position="right" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="red" onClick={onDelete} loading={deleteLoading}>Delete</Button>
        </Group>
      </Modal>

      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">
            {conversationData?.data?.userName}
          </h1>

          <div className=" max-h-[500px] bg-gray-800 border border-gray-700 rounded-lg overflow-y-auto overflow-x-hidden mb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {loadingConversation ? (
              <div className="px-4 py-3">
                <Skeleton height={50} circle mb="xl" />
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} width="70%" radius="xl" />
              </div>
            ) : (
                <div className="flex flex-col p-4 w-full">
               { conversationData?.data?.messages?.map((message, index) => {
                return (
                  <div
                    className={
                      message.from === "Admin"
                        ? "self-end max-w-[70%] m-2 py-2 px-3 bg-green-700 rounded-lg text-white"
                        : "self-start max-w-[70%] m-2 px-3 py-2 bg-gray-700 rounded-lg text-white"
                    }
                    key={index}
                    ref={scroll}
                  >
                    <div className="group relative pr-6">
                      <p className="whitespace-pre-wrap break-words">
                        {message?.message}
                      </p>
                         <h1 className="text-xs text-right pt-1 text-gray-300 opacity-70">
                          {message?.createdAt ? format(message?.createdAt) : ""}
                        </h1>
                     
                      {message?.from === "Admin" && (
                        <div
                          className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 text-red-300 hover:text-red-100"
                          onClick={() => {
                            setMessageId(message?._id);
                            open();
                          }}
                        >
                          <MdDeleteForever size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit(submitMessage)}
            className="grid grid-cols-1 gap-4"
          >
            <div>
              <input
                value={jabberId}
                {...register("jabberId", { required: true })}
                type="hidden"
              />
              <input
                value={auth?.roles[0]}
                {...register("role", { required: true })}
                type="hidden"
              />
              <input
                value={auth?.userName}
                {...register("userName", { required: true })}
                type="hidden"
              />
            </div>
            <div>
                 <Controller
                    name="message"
                    control={control}
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                     <Textarea
                        label="Message"
                        labelProps={{ style: { color: '#d1d5db' } }}
                        placeholder="Describe your issue here, you can also provide links to screenshots. DEPOSIT ISSUES SEND WALLET ADDRESS ALONG"
                        minRows={4}
                        error={errors.message && "Message is required"}
                        {...field}
                         styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' } }}
                     />
                    )}
                />
            </div>
            <div>
                <Button
                    type="submit"
                    loading={messageLoading}
                    color="green"
                    size="md"
                    className="w-full sm:w-auto"
                >
                    Send
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Messages;
