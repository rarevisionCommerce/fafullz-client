import React from "react";
import { Loader, Tabs, Container, Paper, Title, Text, Alert, Center } from "@mantine/core";
import { IconInfoCircle, IconPackage } from "@tabler/icons-react";
import SsnOrders from "./orderpages/SsnOrders";
import GoogleVoiceOrders from "./orderpages/GoogleVoiceOrders";
import TextNowOrders from "./orderpages/TextNowOrders";
import CardsOrders from "./orderpages/CardsOrders";
import FileOrders from "./orderpages/FileOrders";
import AccountsOrders from "./orderpages/AccountsOrders";
import DumpsOrders from "./orderpages/DumpsOrders";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function MyOrders(props) {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const userId = auth?.roles?.includes("Admin") ? props?.buyerId : auth?.userId;

  const fetchOrders = () => {
    return axios.get(`/orders/${userId}`);
  };

  const {
    isLoading: loadingOrders,
    data: orders,
  } = useQuery([`orders-${userId}`], fetchOrders, {
    keepPreviousData: true,
    retry: 1
  });

  const mail = orders?.data?.mail || [];
  const gVoice = orders?.data?.gVoice || [];
  const ssn = orders?.data?.ssn || [];
  const account = orders?.data?.account || [];
  const file = orders?.data?.file || [];
  const card = orders?.data?.card || [];
  const dump = orders?.data?.dump || [];

  if (auth?.roles?.includes("Admin")) {
      // Minimal view for Admin embedded use
      if(loadingOrders) return <Loader size="sm" />;
      // ... Can expand if needed, but for now focusing on main user view refactor mostly or shared structure
  }

  return (
    <Container size="xl" py="lg">
       {!auth?.roles?.includes("Admin") && (
        <Paper p="md" mb="lg" radius="md" withBorder>
            <Title order={2} color="white" mb="xs">My Orders</Title>
            <Alert icon={<IconInfoCircle size="1rem" />} color="blue" variant="light">
                After you buy stuff in shop do not forget save it in your PC.
            </Alert>
        </Paper>
       )}

      {loadingOrders ? (
        <Center h={200}>
            <Loader size="xl" variant="dots" color="yellow" />
            <Text ml="md" color="dimmed">Getting your orders...</Text>
        </Center>
      ) : (
        <Paper p="md" radius="md" shadow="sm" withBorder>
            <Tabs defaultValue="ssn" keepMounted={false} color="green" variant="pills">
            <Tabs.List mb="md">
              <Tabs.Tab value="ssn" icon={<IconPackage size={14}/>}>SSN/DOB</Tabs.Tab>
              <Tabs.Tab value="googleVoice" icon={<IconPackage size={14}/>}>Google Voice</Tabs.Tab>
              <Tabs.Tab value="textNow" icon={<IconPackage size={14}/>}>TextNow/Mail</Tabs.Tab>
              <Tabs.Tab value="cards" icon={<IconPackage size={14}/>}>Cards</Tabs.Tab>
              <Tabs.Tab value="files" icon={<IconPackage size={14}/>}>Files</Tabs.Tab>
              <Tabs.Tab value="accounts" icon={<IconPackage size={14}/>}>Accounts</Tabs.Tab>
              <Tabs.Tab value="dumps" icon={<IconPackage size={14}/>}>Dumps</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="ssn">
              <SsnOrders ssn={ssn} />
            </Tabs.Panel>

            <Tabs.Panel value="googleVoice">
              <GoogleVoiceOrders gVoice={gVoice} />
            </Tabs.Panel>

            <Tabs.Panel value="textNow">
              <TextNowOrders mail={mail} />
            </Tabs.Panel>

            <Tabs.Panel value="cards">
              <CardsOrders card={card} />
            </Tabs.Panel>

            <Tabs.Panel value="files">
              <FileOrders file={file} />
            </Tabs.Panel>

            <Tabs.Panel value="accounts">
              <AccountsOrders account={account} />
            </Tabs.Panel>

            <Tabs.Panel value="dumps">
              <DumpsOrders dump={dump} />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      )}
    </Container>
  );
}

export default MyOrders;
