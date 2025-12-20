import React, { useState, useEffect } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth'
import { Select, TextInput, Button, Tabs } from '@mantine/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import GoogleVoice from '../../pages/dashboard/GoogleVoice'
import MailCategory from './MailCategory'
import FilesCategories from './FilesCategories'
import AccountsCategories from './AccountsCategories'


function SetCategories() {
    const axios = useAxiosPrivate();

  const queryClient = useQueryClient()
  const productsOption = [
    {
        label:'TextNow/Mail', value:"mail"
    },
    {
        label:'File', value:"file"
    },
    {
        label:'Account', value:"account"
    },
  ]
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()

  // add category..............................
  // add function
  const addCategory = (category) => {
    return axios.post(`/categories`, category)
  }

  const { mutate: categoryMutate, isLoading: loadingCategory, error } = useMutation(
    addCategory,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
      queryClient.invalidateQueries(
        ['filescategory-', 'mailcategory-', 'accountsCategory'],
        { refetchActive: true, refetchInactive: true }
      );        
      reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message;
        toast.error(text);

        if (!err.response.data.message) {
          toast.error('something went wrong')
        }
      },
    },
  )
  //   end add category.........


  const submitCategory = (data) => {
     categoryMutate(data)
  }

  return (
    <div className="bg-gray-900 px-3 py-3 rounded-lg text-white">
      <div className="my-[20px] ">
        {/* Add category form */}
        <form
          action=""
          className={
            'bg-gray-800 md:px-6 px-4 py-8 rounded-lg shadow-md mb-6 border border-gray-700'
          }
          onSubmit={handleSubmit(submitCategory)}
        >
          <h1 className="font-bold text-lg text-white mb-6">Select Product To add Category</h1>

          <div className="md:grid md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap- w-full">
            <Controller
              name="productType"
              control={control}
              rules={{ required: "Please select product" }}
              render={({ field }) => (
                <Select
                  label="Product"
                  placeholder="Select product"
                  labelProps={{ style: { color: "#d1d5db" } }}
                  data={productsOption}
                  error={errors.productType?.message}
                  {...field}
                  styles={{ 
                    input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' },
                    item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                    dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                   }}
                />
              )}
            />
          </div>
            <div className="flex flex-col justify-center gap- w-full ">
                 <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Product category is required" }}
                    render={({ field }) => (
                     <TextInput
                        label="Category"
                        labelProps={{ style: { color: "#d1d5db" } }}
                        placeholder="Enter category"
                        error={errors.category?.message}
                        {...field}
                         styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' } }}
                     />
                    )}
                />
            </div>
            <div>
              {loadingCategory ? (
                <div className="mb-1">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <Button
                    type="submit"
                    fullWidth
                    color="blue"
                    className="mb-1"
                >
                  Add Category
                </Button>
              )}
            </div>
          </div>
        </form>
        {/* end of add base form */}

        <div className=" my-6 px-1 md:px-4 ">
          <h1 className="text-lg font-semibold text-white mb-4">All Product and Categories </h1>
        <Tabs defaultValue="mail" styles={{ tab: { color: "#d1d5db", '&[data-active]': { borderColor: '#3b82f6', color: '#3b82f6' }, '&:hover': { backgroundColor: '#374151' } } }}>
            <Tabs.List className='mt-3 '>
                <Tabs.Tab value="mail">textNow/Mail</Tabs.Tab>
                <Tabs.Tab value="file" >Files</Tabs.Tab>
                <Tabs.Tab value="account" >Accounts </Tabs.Tab>
                
            </Tabs.List>

            <Tabs.Panel value="mail" pt="xs" >
                <MailCategory/>

            </Tabs.Panel>

            <Tabs.Panel value="file" pt="xs">
                <FilesCategories/>

            </Tabs.Panel>
            <Tabs.Panel value="account" pt="xs">
            <AccountsCategories/>

            </Tabs.Panel>
 
    </Tabs>
         
        </div>
        <div className="overflow-x-auto mb-3">
         
        </div>
      </div>
    </div>
  )
}

export default SetCategories
