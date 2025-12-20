import React from 'react'
import { Tabs, Paper, Title, Alert, Text, Container } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import SsnUpload from './selller-Upload-forms/SsnUpload';
import AccountsUpload from './selller-Upload-forms/AccountsUpload';
import FileUpload from './selller-Upload-forms/FileUpload';
import GoogleVoiceUpload from './selller-Upload-forms/GoogleVoiceUpload';
import TextNowUpload from './selller-Upload-forms/TextNowUpload';
import CardsUpload from './selller-Upload-forms/CardsUpload';
import DumpsUpload from './selller-Upload-forms/DumpsUpload';
import useAuth from '../hooks/useAuth';

function Sell() {
  const { auth } = useAuth();

  return (
    <div className="bg-gray-900 min-h-screen py-6 px-4">
      <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937', marginBottom: '20px' }}>
          <Title order={2} color="white" align="center" mb="md">Upload Info</Title>
      </Paper>
      
      {auth?.status === "Active" ? (
          <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
            <Tabs 
                defaultValue={auth?.categories[0] || ""} 
                styles={{ 
                    tab: { color: "#d1d5db", '&[data-active]': { borderColor: '#3b82f6', color: '#3b82f6' }, '&:hover': { backgroundColor: '#374151' } } 
                }}
            >
              <Tabs.List>
                <Tabs.Tab value="ssn" className={auth?.categories?.includes('ssn') ? "" : 'hidden'}>SSN/DOB</Tabs.Tab>
                <Tabs.Tab value="gVoice" className={auth?.categories?.includes('gVoice') ? "" : 'hidden'}>Google Voice</Tabs.Tab>
                <Tabs.Tab value="mail" className={auth?.categories?.includes('mail') ? "" : 'hidden'}>TextNow/Mail</Tabs.Tab>
                <Tabs.Tab value="card" className={auth?.categories?.includes('card') ? "" : 'hidden'}>Cards</Tabs.Tab>
                <Tabs.Tab value="file" className={auth?.categories?.includes('file') ? "" : 'hidden'}>Files</Tabs.Tab>
                <Tabs.Tab value="account" className={auth?.categories?.includes('account') ? "" : 'hidden'}>Accounts</Tabs.Tab>
                <Tabs.Tab value="dump" className={auth?.categories?.includes('dump') ? "" : 'hidden'}>Dumps</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="ssn" pt="xs" >
                <SsnUpload />
              </Tabs.Panel>

              <Tabs.Panel value="gVoice" pt="xs">
                <GoogleVoiceUpload />
              </Tabs.Panel>

              <Tabs.Panel value="mail" pt="xs">
                <TextNowUpload />
              </Tabs.Panel>

              <Tabs.Panel value="card" pt="xs">
                <CardsUpload />
              </Tabs.Panel>

              <Tabs.Panel value="file" pt="xs">
                <FileUpload />
              </Tabs.Panel>

              <Tabs.Panel value="account" pt="xs">
                <AccountsUpload />
              </Tabs.Panel>

              <Tabs.Panel value="dump" pt="xs">
                <DumpsUpload />
              </Tabs.Panel>
            </Tabs>
          </Paper>
      ) : (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Suspended" color="red" variant="filled">
            You have been suspended!
          </Alert>
      )}
    </div>
  )
}

export default Sell