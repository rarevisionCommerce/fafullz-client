import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import QrCodeGenerator from "../../components/QrCodeGenerator";
import {
  Container,
  Paper,
  Title,
  Text,
  Select,
  NumberInput,
  Button,
  Loader,
  Group,
  Stack,
  Alert,
  Table,
  Badge,
  ScrollArea,
  Box,
  Center,
  Divider,
  Modal
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconWallet, IconCurrencyBitcoin } from "@tabler/icons-react";

function AddFunds() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const userId = auth?.userId;
  const userName = auth?.userName;

  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [paymentData, setPaymentData] = useState({});
  const [opened, { open, close }] = useDisclosure(false);

  // get currencies
  const getCurrencies = () => {
    return axios.get(`/payments/nowpayments/get-currencies`);
  };

  const {
    isLoading: loadingCurrencies,
    data: currenciesData,
  } = useQuery(["currencies"], getCurrencies, {
    keepPreviousData: true,
  });

  const formattedArray = currenciesData?.data?.selectedCurrencies.map(
    (currency) => {
      let label;
      switch (currency) {
        case "BTC":
          label = "Bitcoin - BTC";
          break;
        case "LTC":
          label = "Litecoin - LTC";
          break;
        case "USDTERC20":
          label = "USDT - ERC20";
          break;
        case "SOL":
          label = "Solana - SOL";
          break;
        default:
          label = currency;
      }
      return { label, value: currency.toLowerCase() };
    }
  );

  // get min amount
  const getMinAmount = () => {
    return axios.get(`/payments/nowpayments/min-amount/${cryptoCurrency}`);
  };

  const {
    data: minAmountData,
    refetch: refetchMinAmount,
  } = useQuery(["min-amount"], getMinAmount, {
    keepPreviousData: true,
    enabled: !!cryptoCurrency,
  });

  useEffect(() => {
    if (cryptoCurrency) {
      refetchMinAmount();
    }
  }, [cryptoCurrency]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // create payment function
  const createPaymentFnc = (payAddress) => {
    return axios.post("/payments/nowpayments/create-payment", payAddress);
  };
  
  const {
    mutate: createPaymentMutate,
    isLoading: loadingCreatePayment,
  } = useMutation(createPaymentFnc, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      setPaymentData(response.data?.paymentData);
      open();
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response?.data?.message) {
        toast.error("something went wrong");
      }
    },
  });

  //   fetching user payment history
  const fetchPayments = () => {
    return axios.get(`/payments/payment-history/${userId}`);
  };

  const {
    isLoading: loadingPayments,
    data: paymentsData,
  } = useQuery(["payments"], fetchPayments, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const submit = (data) => {
    if (!cryptoCurrency) {
      toast.error("Please select cryptocurrency!");
      return;
    }

    const minAmount = parseFloat(minAmountData?.data?.fiat_equivalent);
    if (parseFloat(data.amount) < minAmount) {
      toast.error(
        `Minimum amount for ${cryptoCurrency} is ${Math.ceil(minAmount)}`
      );
      return;
    }

    // Rate Limiting Logic
    const RATE_LIMIT_KEY = "wallet_generation_timestamps";
    const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
    const MAX_REQUESTS = 3;

    const now = Date.now();
    let timestamps = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || "[]");
    
    // Filter out timestamps older than the window
    timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

    if (timestamps.length >= MAX_REQUESTS) {
        toast.error(`Rate limit exceeded: You can only generate ${MAX_REQUESTS} wallets per minute.`);
        return;
    }

    // Add current timestamp and save
    timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));

    data.userId = userId;
    data.userName = userName;
    data.cryptoCurrency = cryptoCurrency;
    createPaymentMutate(data);
  };

  const minAmtValue = minAmountData?.data?.fiat_equivalent ? Math.ceil(minAmountData?.data?.fiat_equivalent) : 0;

  return (
    <Container size="xl" py="xl">
        {/* Payment Modal */}
        <Modal 
            opened={opened} 
            onClose={close} 
            title="Scan to Pay" 
            centered
            size="md"
            styles={{
                header: { backgroundColor: '#f8f9fa' }, // Light header
                body: { backgroundColor: '#f8f9fa' },   // Light body
                title: { color: '#000' },               // Dark text for title
                close: { color: '#000' }                // Dark close button
            }}
        >
             {paymentData?.order_id && (
                <Center>
                    <Stack align="center" spacing="md">
                        <Box p="lg" bg="white" style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}>
                             <QrCodeGenerator data={paymentData} />
                        </Box>
                        <Stack spacing={0} align="center">
                             <Text size="sm" color="dimmed" align="center">Order ID</Text>
                             <Text weight={700} size="md" color="dark">{paymentData.order_id}</Text>
                        </Stack>
                         <div className="text-center bg-red-500 text-white p-2">
                            Send exact amount. Do not close until payment is confirmed if instant.
                        </div>
                    </Stack>
               </Center>
            )}
        </Modal>

      <Stack spacing="xl">
        {/* Info Banner */}
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Important Payment Information"
          color="yellow"
          variant="filled"
        >
          We are using only <strong>one-time</strong> BTC/USDT/LTC addresses! Send <strong>only 1 transaction</strong> per generated wallet. Do not reuse addresses or you will lose your funds.
        </Alert>

        <Group align="flex-start" position="center">
          {/* Payment Form */}
          <Paper shadow="sm" p="xl" radius="md" withBorder w="100%" maw={600}>
            <Title order={3} mb="lg" align="center">Add Balance</Title>
            <Text color="dimmed" size="sm" align="center" mb="md">
              Enter deposit amount and crypto to generate payment wallet!
            </Text>

            <form onSubmit={handleSubmit(submit)}>
              <Stack spacing="md">
                 <Select
                    label="Select Crypto Currency"
                    placeholder={loadingCurrencies ? "Loading currencies..." : "Select one"}
                    data={formattedArray || []}
                    value={cryptoCurrency}
                    onChange={setCryptoCurrency}
                    disabled={loadingCurrencies}
                    searchable
                />

                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Please enter amount",
                    validate: (value) =>
                      parseFloat(value) >= minAmtValue || `Minimum amount for ${cryptoCurrency || 'selected crypto'} is ${minAmtValue}`,
                  }}
                  render={({ field }) => (
                     <NumberInput
                        label="Amount (USD)"
                        description={cryptoCurrency && `Minimum amount: $${minAmtValue}`}
                        placeholder="0.00"
                        min={minAmtValue}
                        disabled={!cryptoCurrency}
                        error={errors.amount?.message}
                        precision={2}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : '$ '
                        }
                        {...field}
                    />
                  )}
                />

                <Button 
                    type="submit" 
                    fullWidth 
                    mt="md" 
                    loading={loadingCreatePayment}
                    leftIcon={<IconWallet size="1rem" />}
                    disabled={!cryptoCurrency}
                    color="green"
                >
                  Get Wallet
                </Button>
              </Stack>
            </form>
          </Paper>
        </Group>

        {/* Persistent Wallet Display */}
        {paymentData?.order_id && (
            <Center>
                <Paper shadow="md" p="xl" radius="md" withBorder w="100%" maw={600} bg="gray.1">
                    <Stack align="center" spacing="md">
                        <Title order={4} color="dark">Wallet Details</Title>
                        <Text size="sm" color="dimmed">
                            Scan the QR code or copy the details below to make your payment.
                        </Text>
                        
                        <Box p="lg" bg="white" style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}>
                                <QrCodeGenerator data={paymentData} />
                        </Box>

                        <Divider w="100%" />

                        <Stack spacing={0} align="center" w="100%">
                                <Text size="xs" color="dimmed" align="center">Order ID</Text>
                                <Text weight={700} size="md" color="dark">{paymentData.order_id}</Text>
                        </Stack>

                        <Stack spacing={0} align="center" w="100%">
                                <Text size="xs" color="dimmed" align="center">Payment Address</Text>
                                <Text weight={700} size="sm" color="dark" style={{ wordBreak: 'break-all' }} align="center">
                                    {paymentData.pay_address}
                                </Text>
                        </Stack>

                        <Stack spacing={0} align="center" w="100%">
                                <Text size="xs" color="dimmed" align="center">Amount to Pay</Text>
                                <Text weight={700} size="lg" color="green">
                                    {paymentData.pay_amount} {cryptoCurrency?.toUpperCase()}
                                </Text>
                        </Stack>

                        <div className="text-center bg-red-500 text-white p-2 rounded w-full">
                            Send exact amount. Do not reuse this address.
                        </div>
                    </Stack>
                </Paper>
            </Center>
        )}

        <Divider my="sm" />

        {/* History Table */}
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group position="apart" mb="md">
                <Title order={3}>Payment History</Title>
                <Badge size="lg" variant="dot" color="blue">Transactions</Badge>
            </Group>

            <ScrollArea>
                <Table striped highlightOnHover fontSize="sm" verticalSpacing="sm">
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>ID/Code</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Wallet Address</th>
                            <th>Coin</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingPayments ? (
                            <tr>
                                <td colSpan={7}>
                                    <Center py="xl">
                                        <Loader color="blue" />
                                    </Center>
                                </td>
                            </tr>
                        ) : paymentsData?.data?.message ? (
                             <tr>
                                <td colSpan={7}>
                                    <Text align="center" py="md">{paymentsData?.data?.message}</Text>
                                </td>
                            </tr>
                        ) : (
                            paymentsData?.data?.transaction?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.id}</td>
                                    <td>
                                        <Badge 
                                            color={item?.status?.toLowerCase() === "confirmed" || item?.status === "Approved" ? "green" : "red"}
                                            variant="light"
                                        >
                                            {item?.status}
                                        </Badge>
                                    </td>
                                    <td>{item?.date?.substr(0, 10)}</td>
                                    <td>
                                        <Text style={{ maxWidth: 200 }} truncate>
                                            {item?.wallet}
                                        </Text>
                                    </td>
                                    <td>{item?.coin}</td>
                                    <td>{item?.amount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </ScrollArea>
        </Paper>
      </Stack>
    </Container>
  );
}

export default AddFunds;
