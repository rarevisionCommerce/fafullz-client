import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import useAuth from '../hooks/useAuth'
import { Skeleton, TextInput, Button, Paper, Text, Grid, Group, Stack, Modal, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import SalesChart from '../components/SalesChart'

function Dash() {
  const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId;
  const userId = auth?.userId;
  const [opened, { open, close }] = useDisclosure(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm()

  //   fetching seller products  infor
  const fetchInfo = () => {
    return axios.get(`/sellers/${sellerId}`)
  }

  const {
    isLoading: loadingProduct,
    data: productsData,
  } = useQuery(['products'], fetchInfo, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  })
  // computing data
  const totalProducts =
    (productsData?.data?.account?.totalProducts || 0) +
    (productsData?.data?.card?.totalProducts || 0) +
    (productsData?.data?.dump?.totalProducts || 0) +
    (productsData?.data?.ssn?.totalProducts || 0) +
    (productsData?.data?.gVoice?.totalProducts || 0) +
    (productsData?.data?.mail?.totalProducts || 0) +
    (productsData?.data?.file?.totalProducts || 0)

  const totalSold =
    (productsData?.data?.account?.soldCount || 0) +
    (productsData?.data?.card?.soldCount || 0) +
    (productsData?.data?.dump?.soldCount || 0) +
    (productsData?.data?.ssn?.soldCount || 0) +
    (productsData?.data?.gVoice?.soldCount || 0) +
    (productsData?.data?.mail?.soldCount || 0) +
    (productsData?.data?.file?.soldCount || 0)

  const totalPrice =
    (productsData?.data?.account?.totalPrice || 0) +
    (productsData?.data?.card?.totalPrice || 0) +
    (productsData?.data?.dump?.totalPrice || 0) +
    (productsData?.data?.ssn?.totalPrice || 0) +
    (productsData?.data?.gVoice?.totalPrice || 0) +
    (productsData?.data?.mail?.totalPrice || 0) +
    (productsData?.data?.file?.totalPrice || 0)

  const sellerEarning = 0.57 * totalPrice

  // chart data for total products
  const productsChartData = {
    title: 'Uploaded Products ',
    values: [
      productsData?.data?.account?.totalProducts,
      productsData?.data?.card?.totalProducts,
      productsData?.data?.ssn?.totalProducts,
      productsData?.data?.gVoice?.totalProducts,
      productsData?.data?.mail?.totalProducts,
      productsData?.data?.dump?.totalProducts,
      productsData?.data?.file?.totalProducts,
    ],
    labels: [
      'Accounts',
      'Cards',
      'Ssn/dob',
      'Gvoice',
      'TextNow',
      'Dumps',
      'Files',
    ],
    backgroundColor: '#184267',
  }

  // chart data for total products
  const salesChartData = {
    title: 'Sold Products ',
    values: [
      productsData?.data?.account?.soldCount,
      productsData?.data?.card?.soldCount,
      productsData?.data?.ssn?.soldCount,
      productsData?.data?.gVoice?.soldCount,
      productsData?.data?.mail?.soldCount,
      productsData?.data?.dump?.soldCount,
      productsData?.data?.file?.soldCount,
    ],
    labels: [
      'Accounts',
      'Cards',
      'Ssn/dob',
      'Gvoice',
      'TextNow',
      'Dumps',
      'Files',
    ],
    backgroundColor: '#008000',
  }
  // check if its sato
  const today = new Date()
  const dayOfWeek = today.getDay() + 1
  //end of fetching payments------------------

  // send withdral request..............................
  // upload function
  const sendRequest = (request) => {
    return axios.post("/withdrawals", request);
  };

  const {
    mutate: withdrwalMutate,
    isLoading: requestLoading,
  } = useMutation(sendRequest, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
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
  });

  const submitRequest = (data) => {
    data.userId = userId;
    data.userName = auth?.userName;
    data.sellerId = sellerId;
    data.amount = sellerEarning?.toFixed(2);
    withdrwalMutate(data);
  };
  // end withdrawal function............................
  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const StatCard = ({ title, value }) => (
    <Paper shadow="md" p="md" radius="md" sx={{ backgroundColor: '#184267', color: 'white', '&:hover': { opacity: 0.9 } }}>
      <Stack align="center" spacing={5}>
        <Text size="lg" weight={600} align="center">
          {title}
        </Text>
        <Text size="xl" weight={700} align="center">
           {value}
        </Text>
      </Stack>
    </Paper>
  );

  return (
    <div className="bg-gray-900 min-h-screen py-6 px-4 md:px-6">
        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937', marginBottom: '20px' }}>
             <Title order={2} color="white" mb="md" style={{ textDecoration: 'underline' }}>Dashboard/Analytics</Title>
             
             {loadingProduct ? (
                <Grid>
                    <Grid.Col span={12} sm={6} md={3}><Skeleton height={140} radius="md" /></Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}><Skeleton height={140} radius="md" /></Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}><Skeleton height={140} radius="md" /></Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}><Skeleton height={140} radius="md" /></Grid.Col>
                </Grid>
             ) : (
                <Grid>
                    <Grid.Col span={12} sm={6} md={3}>
                        <StatCard title="Products Uploaded" value={totalProducts || 0} />
                    </Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}>
                        <StatCard title="Total Sold Products" value={totalSold || 0} />
                    </Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}>
                        <StatCard title="Total Earnings" value={`$${formatCurrency(sellerEarning || 0)}`} />
                    </Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}>
                         <Paper shadow="md" p="md" radius="md" sx={{ backgroundColor: '#184267', color: 'white', '&:hover': { opacity: 0.9 } }}>
                            <Stack align="center" spacing={5}>
                                <Text size="lg" weight={600} align="center">Withdraw</Text>
                                 <div className="text-center text-sm text-green-400 font-semibold my-2">
                                    {dayOfWeek === 7 ? (
                                    <Text
                                        variant="link"
                                        component="span"
                                        onClick={open}
                                        style={{ cursor: 'pointer', color: '#4ade80', textDecoration: 'underline' }}
                                    >
                                        Send withdraw Request
                                    </Text>
                                    ) : (
                                        <Text size="sm" color="dimmed" style={{ color: '#9ca3af' }}>Withdrawals are processed on Saturday</Text>
                                    )}
                                </div>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
             )}
        </Paper>

        <Modal 
            opened={opened} 
            onClose={close} 
            title={<Text color="white">Send Withdraw Request</Text>}
            centered
            overlayProps={{
              opacity: 0.55,
              blur: 3,
            }}
            styles={{ 
                content: { backgroundColor: '#1f2937', color: 'white' },
                header: { backgroundColor: '#1f2937', color: 'white' },
                close: { color: 'white', '&:hover': { backgroundColor: '#374151' } }
            }}
        >
            <form onSubmit={handleSubmit(submitRequest)}>
                <Stack>
                     <Controller
                        name="wallet"
                        control={control}
                        rules={{ required: "Address is required" }}
                        render={({ field }) => (
                            <TextInput
                                label="Address (BTC wallet to receive payment)"
                                placeholder="Enter BTC wallet address"
                                withAsterisk
                                error={errors.wallet?.message}
                                {...field}
                                styles={{ 
                                    label: { color: "#d1d5db" },
                                    input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                                }}
                            />
                        )}
                    />
                    
                    <Group position="right" mt="md">
                        <Button variant="default" onClick={close}>Cancel</Button>
                        <Button 
                            type="submit" 
                            disabled={sellerEarning < 1} 
                            loading={requestLoading}
                            color="blue"
                        >
                            Send
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
             <SalesChart data={productsChartData} />
        </Paper>
        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
            <SalesChart data={salesChartData} />
        </Paper>
      </div>
    </div>
  )
}

export default Dash
