import React from "react";
import { Tabs } from "@mantine/core";
import AccountProducts from "./Productpages/AccountProducts";
import CardProducts from "./Productpages/CardProducts";
import DumpProducts from "./Productpages/DumpProducts";
import FileProducts from "./Productpages/FileProducts";
import GoogleVoiceProducts from "./Productpages/GoogleVoiceProducts";
import SsnProducts from "./Productpages/SsnProducts";
import TextNowProducts from "./Productpages/TextNowProducts";

function MyProduct() {
  return (
    <div className="border bg-light rounded-md min-h-screen  shadow-md  ">
      <div className="bg-gray-100  my-6 mx-1 md:mx-5 ">
        <div className="bg-gray-300 w-full rounded-t-md h-10"></div>
        <h1 className="mb-4 text-center font-bold text-xl ">My Products </h1>

        <div className="flex justify-end mt-8">
          {/* <div className="flex flex-col gap-1 mb-6 min-w-[250px] ">
          <h1>OnPage</h1>
          <Select options={onPage} />
        </div> */}
        </div>
      </div>

      <div className=" overflow-x-auto my-6 mx-1 md:mx-5">
        <Tabs defaultValue="ssn">
          <Tabs.List>
            <Tabs.Tab value="ssn">SSN/DOB</Tabs.Tab>
            {/* <Tabs.Tab value="googleVoice">Google Voice</Tabs.Tab>
            <Tabs.Tab value="textNow">TextNow/Mail</Tabs.Tab>
            <Tabs.Tab value="cards">Cards</Tabs.Tab>
            <Tabs.Tab value="files">Files</Tabs.Tab>
            <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
            <Tabs.Tab value="dumps">Dumps</Tabs.Tab> */}
          </Tabs.List>

          <Tabs.Panel value="ssn" pt="xs">
            <SsnProducts />
          </Tabs.Panel>

          <Tabs.Panel value="googleVoice" pt="xs">
            <GoogleVoiceProducts />
          </Tabs.Panel>

          <Tabs.Panel value="textNow" pt="xs">
            <TextNowProducts />
          </Tabs.Panel>

          <Tabs.Panel value="cards" pt="xs">
            <CardProducts />
          </Tabs.Panel>

          <Tabs.Panel value="files" pt="xs">
            <FileProducts />
          </Tabs.Panel>

          <Tabs.Panel value="accounts" pt="xs">
            <AccountProducts />
          </Tabs.Panel>

          <Tabs.Panel value="dumps" pt="xs">
            <DumpProducts />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default MyProduct;
