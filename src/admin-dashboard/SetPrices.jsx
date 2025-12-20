import React from "react";
import { Tabs } from "@mantine/core";

import useAuth from "../hooks/useAuth";
import SetSsnBase from "./set-prices-components/SetSsnBase";
import SetProductsPrices from "./set-prices-components/SetProductsPrices";
import SetCategories from "./set-prices-components/SetCategories";

function SetPrices() {
  const { auth } = useAuth();

  return (
    <div className="bg-gray-900 min-h-screen shadow-md p-4">
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <h1 className="text-center font-bold text-xl text-white">
          Set Product Prices{" "}
        </h1>
      </div>
      {auth?.status === "Active" ? (
        //selling tabs
        <div className="w-full">
          <Tabs defaultValue="ssn" styles={{ tab: { color: "#d1d5db", '&[data-active]': { borderColor: '#3b82f6', color: '#3b82f6' }, '&:hover': { backgroundColor: '#374151' } } }}>
            <Tabs.List>
              <Tabs.Tab value="ssn">
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
