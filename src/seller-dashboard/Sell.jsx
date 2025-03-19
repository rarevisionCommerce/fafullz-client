import React from 'react'
import { Tabs } from '@mantine/core';
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
    <div className="border bg-light rounded-md min-h-screen  shadow-md  ">
      <div className="bg-gray-100  my-6 mx-1 md:mx-5 ">
        <div className="bg-gray-300 w-full rounded-t-md h-10"></div>
        <h1 className="mb-4 text-center font-semibold text-xl h-14 ">Upload info </h1>

      </div>
      {
        auth?.status === "Active" ?


          //selling tabs
          <div className=" overflow-x-auto my-6 mx-1 md:mx-5">
            <Tabs defaultValue={auth?.categories[0]|| ""}>
              <Tabs.List>
                <Tabs.Tab value="ssn" className={auth?.categories?.includes('ssn') ? "border" : 'hidden'}>SSN/DOB</Tabs.Tab>
                {/* <Tabs.Tab value="gVoice" className={auth?.categories?.includes('gVoice') ? "" : 'hidden'}>Google Voice</Tabs.Tab>
                <Tabs.Tab value="mail" className={auth?.categories?.includes('mail') ? "" : 'hidden'}>TextNow/Mail</Tabs.Tab>
                <Tabs.Tab value="card" className={auth?.categories?.includes('card') ? "" : 'hidden'}>Cards</Tabs.Tab>
                <Tabs.Tab value="file" className={auth?.categories?.includes('file') ? "" : 'hidden'}>Files</Tabs.Tab>
                <Tabs.Tab value="account" className={auth?.categories?.includes('account') ? "" : 'hidden'}>Accounts</Tabs.Tab>
                <Tabs.Tab value="dump" className={auth?.categories?.includes('dump') ? "" : 'hidden'}>Dumps</Tabs.Tab> */}
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


          </div>
          :
          <div className='px-5 text-center text-red-500'>
            <h1 className='text-xl'>You have been suspended!</h1>
          </div>
      }



    </div>
  )
}

export default Sell