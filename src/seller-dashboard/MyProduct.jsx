import React from "react";
import { Tabs, Paper, Title } from "@mantine/core";
import AccountProducts from "./Productpages/AccountProducts";
import CardProducts from "./Productpages/CardProducts";
import DumpProducts from "./Productpages/DumpProducts";
import FileProducts from "./Productpages/FileProducts";
import GoogleVoiceProducts from "./Productpages/GoogleVoiceProducts";
import SsnProducts from "./Productpages/SsnProducts";
import TextNowProducts from "./Productpages/TextNowProducts";

function MyProduct() {
  return (
    <div className="bg-gray-900 min-h-screen py-6 px-4">
      <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937', marginBottom: '20px' }}>
         <Title order={2} color="white" align="center" mb="md">My Products</Title>
      </Paper>

      <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
        <Tabs 
            defaultValue="ssn"
            styles={{ 
                tab: { color: "#d1d5db", '&[data-active]': { borderColor: '#3b82f6', color: '#3b82f6' }, '&:hover': { backgroundColor: '#374151' } } 
            }}
        >
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
      </Paper>
    </div>
  );
}

export default MyProduct;
