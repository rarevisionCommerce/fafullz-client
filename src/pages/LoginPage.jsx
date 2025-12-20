import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
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
  Divider
} from "@mantine/core";
import { IconAlertCircle, IconUser, IconLock } from "@tabler/icons-react";
import { FaTelegramPlane } from "react-icons/fa";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

import hacker from "../assets/graphics/fafullz.jpg";
import logo from "../assets/graphics/fafullz-logo.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { setAuth } = useAuth();
  const location = useLocation();
  const toDash = location.state?.from?.pathname || "/dash";
  const toSellerDash = location.state?.from?.pathname || "/seller-dash";
  const toAdminDash = location.state?.from?.pathname || "/admin-dash";
  const [inActive, setInActive] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");

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

  const {
    mutate: loginMutate,
    isLoading: loginLoading,
  } = useMutation(login, {
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
      const text = err?.response?.data?.message;
      if (text === "Inactive") {
        setInActive(true);
      }
      setErrMsg(text);
      setTimeout(() => {
        setErrMsg("");
      }, 10000);
      if (!err?.response?.data?.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = (data) => {
    data.accountType = "rarevision";

    if (validateCaptcha(captchaValue) === true) {
      loginMutate(data);
    } else {
      toast.error("Captcha Does Not Match");
      setCaptchaValue("");
      // reload captcha logic might be needed here usually, but keeping original logic
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Paper shadow="xl" radius="md" className="overflow-hidden w-full max-w-[1000px] bg-[#1A1B1E]">
        <Grid gutter={0}>
          {/* Image Column */}
          <Grid.Col span={12} md={6} className="hidden md:block">
            <BackgroundImage
              src={hacker}
              h="100%"
              className="min-h-[500px] flex items-end p-8"
            >
              <Box className="bg-black/60 p-4 rounded text-white">
                <Title order={2} className="text-white mb-2">Welcome Back</Title>
                <Text size="sm" className="text-gray-300">
                  Secure access to your Fafullz dashboard.
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
                  Account Login
                </Title>

                {inActive && (
                  <Alert
                    icon={<IconAlertCircle size="1rem" />}
                    title="Inactive User"
                    color="lime"
                    variant="filled"
                  >
                    Contact admin to activate your account.
                  </Alert>
                )}
                
                {errMsg && (
                   <Alert color="red" variant="light">
                       {errMsg}
                   </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmitting)}>
                  <Stack spacing="md">
                    <TextInput
                      label="Username"
                      placeholder="Your username"
                      icon={<IconUser size="0.8rem" />}
                      size="md"
                      {...register("userName", { required: "Username is required" })}
                      error={errors.userName?.message}
                      variant="filled"
                      styles={{ input: { backgroundColor: '#2C2E33', color: 'white' }, label: {color: '#C1C2C5'} }}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      icon={<IconLock size="0.8rem" />}
                      size="md"
                      {...register("password", { required: "Password is required" })}
                      error={errors.password?.message}
                      variant="filled"
                        styles={{ input: { backgroundColor: '#2C2E33', color: 'white' }, innerInput: {color: 'white'}, label: {color: '#C1C2C5'} }}
                    />

                    {/* Captcha Section */}
                    <Box className="bg-gray-800 p-3 rounded text-center">
                        <LoadCanvasTemplate reloadColor="white" />
                    </Box>
                    
                    <TextInput
                        placeholder="Enter Captcha Value"
                        value={captchaValue}
                        onChange={(e) => setCaptchaValue(e.target.value)}
                        size="md"
                        variant="filled"
                         styles={{ input: { backgroundColor: '#2C2E33', color: 'white' } }}
                    />

                    <Button 
                        fullWidth 
                        mt="xl" 
                        size="md" 
                        type="submit" 
                        loading={loginLoading}
                        color="green"
                    >
                      Login
                    </Button>
                  </Stack>
                </form>

                <Group position="center" mt="md">
                  <Text color="dimmed" size="sm">
                    Don't have an account?{' '}
                    <Anchor component={Link} to="/register" weight={700} color="green">
                      Create an Account
                    </Anchor>
                  </Text>
                </Group>
                
                <Divider my="sm" label="OR" labelPosition="center" />
                
                 <a href="https://t.me/fafullzz" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <Button 
                        fullWidth 
                        variant="light" 
                        leftIcon={<FaTelegramPlane />}
                    >
                        Join Us on Telegram
                    </Button>
                </a>
              </Stack>
            </Container>
          </Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
}

export default LoginPage;
