import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Title,
  Text,
  PasswordInput,
  Button,
  Stack,
  ThemeIcon,
  List,
  Group,
  Alert,
  Center
} from "@mantine/core";
import { IconLock, IconCheck, IconAlertCircle } from "@tabler/icons-react";

function ChangePassword() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

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
  const { register, handleSubmit, reset, formState: { errors } } = useForm(formOptions);

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

  return (
    <Container size="sm" py="xl">
        <Center>
            <Paper shadow="md" p="xl" radius="md" withBorder w={500} mt="xl">
                <Stack align="center" mb="lg" spacing="xs">
                    <ThemeIcon size={60} radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                        <IconLock size={30} />
                    </ThemeIcon>
                    <Title order={2} align="center">Change Password</Title>
                    <Text color="dimmed" size="sm" align="center">
                        Keep your account secure with a strong password
                    </Text>
                </Stack>

                <form onSubmit={handleSubmit(handlePasswordChange)}>
                    <Stack spacing="md">
                        <PasswordInput
                            label="New Password"
                            placeholder="Enter new password"
                            icon={<IconLock size="1rem" />}
                            {...register("password")}
                            error={errors.password?.message}
                            radius="md"
                        />
                        
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            icon={<IconLock size="1rem" />}
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                            radius="md"
                        />

                        <Button 
                            type="submit" 
                            fullWidth 
                            mt="xl" 
                            size="md"
                            loading={loadingChangePass}
                            radius="md"
                            variant="gradient" 
                            gradient={{ from: 'blue', to: 'cyan' }}
                        >
                            Update Password
                        </Button>
                    </Stack>
                </form>

                <Alert icon={<IconAlertCircle size="1rem" />} title="Security Tips" color="blue" variant="light" mt="xl" radius="md">
                    <List spacing="xs" size="sm" center icon={
                        <ThemeIcon color="blue" size={20} radius="xl">
                            <IconCheck size="0.7rem" />
                        </ThemeIcon>
                    }>
                        <List.Item>Use at least 8 characters</List.Item>
                        <List.Item>Include uppercase & lowercase letters</List.Item>
                        <List.Item>Add numbers & special characters</List.Item>
                        <List.Item>Avoid using personal information</List.Item>
                    </List>
                </Alert>
            </Paper>
        </Center>
    </Container>
  );
}

export default ChangePassword;
