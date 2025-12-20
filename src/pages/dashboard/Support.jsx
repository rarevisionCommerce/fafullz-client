import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import {
  Container,
  Paper,
  Title,
  Text,
  Textarea,
  Button,
  Loader,
  ScrollArea,
  Group,
  Stack,
  Avatar,
  Box,
  Grid,
  Alert
} from "@mantine/core";
import { IconSend, IconMessageCircle, IconUser, IconHeadset, IconInfoCircle } from "@tabler/icons-react";

function Support() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const viewport = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch conversation
  const getConversation = () => {
    return axios.get(`/support/messages/customer/${auth?.jabberId}`);
  };

  const {
    data: conversationData,
    isLoading: loadingConversation,
  } = useQuery({
    queryKey: [`messages-${auth?.jabberId}`],
    queryFn: getConversation,
    refetchInterval: 3000,
    onSuccess: () => {
        // Scroll to bottom on polling update if near bottom or initial load could be handled here
    }
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (viewport.current) {
        viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversationData?.data?.messages?.length]);


  // Upload message
  const uploadMessage = (message) => {
    return axios.post("/support", message);
  };

  const {
    mutate: messageMutate,
    isLoading: messageLoading,
  } = useMutation({
    mutationFn: uploadMessage,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries([`messages-${auth?.jabberId}`]);
      reset();
    },
    onError: (err) => {
      const text = err?.response?.data?.message || "Something went wrong";
      toast.error(text);
    },
  });

  const submitMessage = (data) => {
    if(!auth?.jabberId || !auth?.roles?.[0] || !auth?.userName) {
        toast.error("User information missing, cannot send message.");
        return;
    }
    const payload = {
        jabberId: auth.jabberId,
        role: auth.roles[0],
        userName: auth.userName,
        message: data.message
    };
    messageMutate(payload);
  };

  return (
    <Container size="md" py="xl" h="90vh">
        <Paper shadow="sm" radius="md" withBorder h="100%" display="flex" style={{ flexDirection: 'column' }}>
            {/* Header */}
            <Box p="md" bg="dark.8" style={{ borderBottom: '1px solid #373A40', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                <Group>
                    <IconHeadset size={24} color="#40c057" />
                    <div>
                        <Title order={4}>Chat with Support</Title>
                        <Text size="xs" color="dimmed">Describe your issue here. For deposit issues, send wallet address along.</Text>
                    </div>
                </Group>
            </Box>

            {/* Chat Area */}
            <ScrollArea viewportRef={viewport} flex={1} p="md" bg="dark.9">
                {loadingConversation ? (
                    <Stack align="center" justify="center" h="100%">
                        <Loader variant="dots" color="green" />
                        <Text color="dimmed">Loading conversation...</Text>
                    </Stack>
                ) : conversationData?.data?.messages?.length === 0 ? (
                     <Stack align="center" justify="center" h="100%" spacing="xs">
                        <IconMessageCircle size={48} color="#adb5bd" />
                        <Text color="dimmed">No messages yet. Start a conversation below.</Text>
                    </Stack>
                ) : (
                    <Stack spacing="md">
                        {conversationData?.data?.messages?.map((message, index) => {
                            const isUser = message.from === auth?.roles[0];
                            return (
                                <Group 
                                    key={index} 
                                    position={isUser ? "right" : "left"} 
                                    align="flex-start" 
                                    noWrap
                                >
                                    {!isUser && <Avatar radius="xl" bg="blue" size="md"><IconHeadset size="1rem"/></Avatar>}
                                    <Stack spacing={4} style={{ maxWidth: '75%' }}>
                                        <Paper 
                                            p="xs" 
                                            radius="md" 
                                            bg={isUser ? "green.9" : "dark.6"} 
                                            c={isUser ? "white" : "gray.3"}
                                            withBorder={!isUser}
                                            shadow="xs"
                                        >
                                            <Text size="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {message.message}
                                            </Text>
                                        </Paper>
                                        <Text size="xs" color="dimmed" align={isUser ? "right" : "left"}>
                                            {message?.createdAt ? format(message.createdAt) : ""}
                                        </Text>
                                    </Stack>
                                    {isUser && <Avatar radius="xl" src={null} color="green" size="md"><IconUser size="1rem"/></Avatar>}
                                </Group>
                            );
                        })}
                    </Stack>
                )}
            </ScrollArea>

            {/* Input Area */}
            <Box p="md" bg="dark.8" style={{ borderTop: '1px solid #373A40', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                <form onSubmit={handleSubmit(submitMessage)}>
                    <Grid align="flex-end">
                        <Grid.Col span="auto">
                             <Textarea
                                placeholder="Type your message..."
                                autosize
                                minRows={1}
                                maxRows={4}
                                {...register("message", { required: true })}
                                error={errors.message && "Message is required"}
                                disabled={messageLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(submitMessage)();
                                    }
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span="content">
                            <Button 
                                type="submit" 
                                color="green" 
                                leftIcon={<IconSend size={16} />}
                                loading={messageLoading}
                            >
                                Send
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Paper>
    </Container>
  );
}

export default Support;
