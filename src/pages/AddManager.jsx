import React, { useState } from "react";
import { HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { CgLogIn } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { TextInput, PasswordInput, Button, Container, Title, Paper, Text } from "@mantine/core";
import useAuth from "../hooks/useAuth";

function AddManager() {
  const [errMsg, setErrMsg] = useState("");
  const { auth } = useAuth();

  const {
    control,
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
      toast.success("Manager registered successfully");
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
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
    data.roles = "Manager";
    registerMutate(data);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center py-10">
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, color: 'white' })}
        >
          Register Manager
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
           Enter Details to create a new manager
        </Text>
        
        {errMsg && <Text color="red" align="center" mt="md">{errMsg}</Text>}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
          <form onSubmit={handleSubmit(onSubmitting)}>
            <Controller
                name="userName"
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                    <TextInput 
                        label="Username" 
                        placeholder="Username" 
                        required 
                        mt="md"
                        icon={<HiUser size="1rem" />}
                        error={errors.userName?.message}
                        disabled={!auth?.roles?.includes("Admin")}
                        {...field}
                         styles={{ 
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                )}
            />
            
            <Controller
                name="jabberId"
                control={control}
                rules={{ required: "Jabber ID is required" }}
                render={({ field }) => (
                    <TextInput 
                        label="Jabber ID" 
                        placeholder="Jabber ID" 
                        required 
                        mt="md"
                        icon={<MdEmail size="1rem" />}
                        error={errors.jabberId?.message}
                        disabled={!auth?.roles?.includes("Admin")}
                        {...field}
                        styles={{ 
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                    <PasswordInput 
                        label="Password" 
                        placeholder="Password" 
                        required 
                        mt="md"
                        icon={<RiLockPasswordFill size="1rem" />}
                        error={errors.password?.message}
                        disabled={!auth?.roles?.includes("Admin")}
                        {...field}
                        styles={{ 
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                            innerInput: { color: 'white' }
                        }}
                    />
                )}
            />

            <Button 
                fullWidth 
                mt="xl" 
                type="submit" 
                loading={registerLoading}
                disabled={!auth?.roles?.includes("Admin")}
                leftIcon={<CgLogIn size="1rem" />}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default AddManager;
