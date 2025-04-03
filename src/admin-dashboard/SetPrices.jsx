import React from "react";
import { Tabs } from "@mantine/core";

import useAuth from "../hooks/useAuth";
import SetSsnBase from "./set-prices-components/SetSsnBase";
import SetProductsPrices from "./set-prices-components/SetProductsPrices";
import SetCategories from "./set-prices-components/SetCategories";

function SetPrices() {
  const { auth } = useAuth();

  return (
    <div className="border bg-light rounded-md min-h-screen  shadow-md  ">
      <div className="bg-gray-100  my-6 mx-1 md:mx-5 ">
        <div className="bg-gray-300 w-full rounded-t-md h-10"></div>
        <h1 className="mb-4 text-center font-semibold text-xl h-14 ">
          Set Product Prices{" "}
        </h1>
      </div>
      {auth?.status === "Active" ? (
        //selling tabs
        <div className=" overflow-x-auto my-6 mx-1 md:mx-5">
          <Tabs defaultValue="ssn">
            <Tabs.List>
              <Tabs.Tab value="ssn" className=" border">
                SSN/DOB
              </Tabs.Tab>
              <Tabs.Tab value="googleVoice">Set Other Product Prices</Tabs.Tab>
              <Tabs.Tab value="categories">Set Product Categories</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="ssn" pt="xs">
              <SetSsnBase />
            </Tabs.Panel>

            <Tabs.Panel value="googleVoice" pt="xs">
              <SetProductsPrices />
            </Tabs.Panel>
            <Tabs.Panel value="categories" pt="xs">
              <SetCategories />
            </Tabs.Panel>
          </Tabs>
        </div>
      ) : (
        <div className="px-5 text-center text-red-500">
          <h1 className="text-xl">You have been suspended!</h1>
        </div>
      )}
    </div>
  );
}

export default SetPrices;
