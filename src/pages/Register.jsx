import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Anchor,
  Stack,
  Alert,
  Grid,
  BackgroundImage,
  Center,
  Box,
  Image,
} from "@mantine/core";
import { IconUser, IconLock, IconMail } from "@tabler/icons-react";

import hacker from "../assets/graphics/fafullz.jpg";
import logo from "../assets/graphics/fafullz-logo.jpg";

function Register() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Paper shadow="xl" radius="md" className="overflow-hidden w-full max-w-[1000px] bg-[#1A1B1E]">
        <Grid gutter={0}>
          {/* Image Column - Keep consistent with Login */}
          <Grid.Col span={12} md={6} className="hidden md:block">
            <BackgroundImage
              src={hacker}
              h="100%"
              className="min-h-[500px] flex items-end p-8"
            >
              <Box className="bg-black/60 p-4 rounded text-white">
                <Title order={2} className="text-white mb-2">Join the Community</Title>
                <Text size="sm" className="text-gray-300">
                  Create your account to start buying and selling on Fafullz.
                </Text>
              </Box>
            </BackgroundImage>
          </Grid.Col>

          {/* Form Column */}
          <Grid.Col span={12} md={6}>
            <Container p={30} size="xs" py={50}>
               <Stack spacing="lg">
                 <Center>
                    <Group spacing="xs">
                        <Image src={logo} width={40} height={40} />
                        <Title className="text-white">Fafullz</Title>
                    </Group>
                </Center>
                
                <Title order={2} align="center" className="text-white" mt="md" mb="md">
                  Create Account
                </Title>

                 {errMsg && (
                   <Alert color="red" variant="light">
                       {errMsg}
                   </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmitting)}>
                  <Stack spacing="md">
                    <TextInput
                      label="Username"
                      placeholder="Choose a username"
                      icon={<IconUser size="0.8rem" />}
                      size="md"
                      {...register("userName", { required: "Username is required" })}
                      error={errors.userName?.message}
                      variant="filled"
                      styles={{ input: { backgroundColor: '#2C2E33', color: 'white' }, label: {color: '#C1C2C5'} }}
                    />

                    <TextInput
                      label="Email / Jabber ID"
                      placeholder="Enter your contact info"
                      icon={<IconMail size="0.8rem" />}
                      size="md"
                      {...register("jabberId", { required: "JabberId is required" })}
                      error={errors.jabberId?.message}
                      variant="filled"
                      styles={{ input: { backgroundColor: '#2C2E33', color: 'white' }, label: {color: '#C1C2C5'} }}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Create a password"
                      icon={<IconLock size="0.8rem" />}
                      size="md"
                      {...register("password", { required: "Password is required" })}
                      error={errors.password?.message}
                      variant="filled"
                      styles={{ input: { backgroundColor: '#2C2E33', color: 'white' }, innerInput: {color: 'white'}, label: {color: '#C1C2C5'} }}
                    />

                    <Button 
                        fullWidth 
                        mt="xl" 
                        size="md" 
                        type="submit" 
                        loading={registerLoading}
                        color="green"
                    >
                      Register
                    </Button>
                  </Stack>
                </form>

                 <Group position="center" mt="md">
                  <Text color="dimmed" size="sm">
                    Already have an account?{' '}
                    <Anchor component={Link} to="/" weight={700} color="green">
                      Back to Login
                    </Anchor>
                  </Text>
                </Group>
               </Stack>
            </Container>
          </Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
}

export default Register;
