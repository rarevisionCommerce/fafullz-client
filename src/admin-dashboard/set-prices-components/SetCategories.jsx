import React, { useState, useEffect } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth'
import Select from 'react-select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Pagination } from '@mantine/core'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import GoogleVoice from '../../pages/dashboard/GoogleVoice'
import { Tabs } from '@mantine/core';
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
        toast.success(response?.data?.message)
      queryClient.invalidateQueries(
        ['filescategory-', 'mailcategory-', 'accountsCategory'],
        { refetchActive: true, refetchInactive: true }
      );        
      reset()
      },
      onError: (err) => {
        const text = err?.response?.data?.message
        toast.error(text)

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
    <div className="bg-light px-3 py-3">
      <div className="my-[20px] ">
        {/* Add category form */}
        <form
          action=""
          className={
            'bg-gray-100 md:px-4 px-2 py-3 min-h-[150px] shadow-md mb-2'
          }
          onSubmit={handleSubmit(submitCategory)}
        >
          <h1 className="font-bold text-md">Select Product To add Category</h1>

          <div className="md:grid  md:grid-cols-3   gap-5 my-3 ">
            <div className="flex flex-col gap- w-full">
            <label htmlFor="">
              
              Product 
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>
            <Controller
              name="productType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={productsOption}
                  value={productsOption.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value);
                  }}
                />
              )}
            />
            {errors.productType && (
              <p className="text-red-500 text-xs">Please select product</p>
            )}
          </div>
            <div className="flex flex-col justify-center gap- w-full ">
              <h1>Category</h1>
              <input
                type="text"
                className="border-2 w-full rounded-md py-[6px]  px-2 outline-none  focus:border-gray-700 focus:border-[1px] "
                {...register('category', {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.category?.type === 'required' && 'Product category is required'}
              </p>
            </div>
            <div>
              {loadingCategory ? (
                <div className="mt-8">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <button className="bg-primary ml6 mt-7 text-white rounded-md px-5 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300">
                  Add Category
                </button>
              )}
            </div>
          </div>
        </form>
        {/* end of add base form */}

        <div className=" my-6 px-1 md:px-4 ">
          <h1 className="text-lg font-semibold">All Product and Categories </h1>
        <Tabs defaultValue="mail">
            <Tabs.List className='bg-gray-300 w-auto mt-3 '>
                <Tabs.Tab value="mail" className=' border' >textNow/Mail</Tabs.Tab>
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
