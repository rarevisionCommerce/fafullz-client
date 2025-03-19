import React from "react";
import Select from "react-select";
import { Link, useParams } from "react-router-dom";
import { Loader, Tabs } from "@mantine/core";
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
import PulseLoader from "react-spinners/PulseLoader";

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
    refetch,
    isRefetching: refetchingOrdes,
  } = useQuery([`files-${userId}`], fetchOrders, {
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

  return (
    <div className="min-h-screen">
      <div
        className={
          auth?.roles?.includes("Admin") ? "hidden" : "bg-dark3  rounded-t-md "
        }
      >
        <div className="bg-slate-700 w-full rounded-t-md h-10"></div>
        <h1 className="mb-4 text-light  font-bold text-xl px-3  ">
          My Orders{" "}
        </h1>

        <p className="text-light text-sm px-3 ">
          After you buy stuff in shop do not forget save it in your PC.
        </p>
        <div className="flex justify-end mt-8"></div>
      </div>

      {loadingOrders ? (
        <div className="flex justify-center items-center pt-8">
          <p className="text-center text-light flex items-center gap-2">
           <span>Geeting your orders</span> <Loader color="yellow" size={30} />
          </p>
        </div>
      ) : (
        //  tabs start
        <div className=" overflow-x-auto my-6 mx-1 md:mx-5">
          <SsnOrders ssn={ssn} />
          {/* <Tabs defaultValue="ssn">
            <Tabs.List>
              <Tabs.Tab value="ssn">SSN/DOB</Tabs.Tab>
              <Tabs.Tab value="googleVoice">Google Voice</Tabs.Tab>
              <Tabs.Tab value="textNow">TextNow/Mail</Tabs.Tab>
              <Tabs.Tab value="cards">Cards</Tabs.Tab>
              <Tabs.Tab value="files">Files</Tabs.Tab>
              <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
              <Tabs.Tab value="dumps">Dumps</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="ssn" pt="xs">
              <SsnOrders ssn={ssn} />
            </Tabs.Panel>

            <Tabs.Panel value="googleVoice" pt="xs">
              <GoogleVoiceOrders gVoice={gVoice} />
            </Tabs.Panel>

            <Tabs.Panel value="textNow" pt="xs">
              <TextNowOrders mail={mail} />
            </Tabs.Panel>

            <Tabs.Panel value="cards" pt="xs">
              <CardsOrders card={card} />
            </Tabs.Panel>

            <Tabs.Panel value="files" pt="xs">
              <FileOrders file={file} />
            </Tabs.Panel>

            <Tabs.Panel value="accounts" pt="xs">
              <AccountsOrders account={account} />
            </Tabs.Panel>

            <Tabs.Panel value="dumps" pt="xs">
              <DumpsOrders dump={dump} />
            </Tabs.Panel>
          </Tabs> */}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
