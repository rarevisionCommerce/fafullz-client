import React, { useState, useEffect } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth'
import { Select, TextInput, NumberInput, Button } from '@mantine/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import GoogleVoice from '../../pages/dashboard/GoogleVoice'

function SetProductsPrices() {
    const axios = useAxiosPrivate();

  const queryClient = useQueryClient()
  const productsOption = [
    {
        label:'Google Voice', value:"gVoice"
    },
    {
        label:'TextNow/Mail', value:"mail"
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

  // add base..............................
  // add function
  const addBase = (base) => {
    return axios.post(`/prices`, base)
  }

  const { mutate: baseMutate, isLoading: loadingBase, error } = useMutation(
    addBase,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([`prices-`]);
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
  //   end add base.........

  // fetching prices
  const fetchPrices = () => {
    return axios.get(`/prices`)
  }

  const { isLoading: loadingPrices, data: pricesData, } = useQuery(
    [`prices-`],
    fetchPrices,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  //end of fetching bases------------------

  const submitBase = (data) => {
    baseMutate(data)
  }

  const productMap = {
    gVoice: "GoogleVoice",
    mail: "TexNow/Mail"

  }

  return (
    <div className="bg-gray-900 px-3 py-3 rounded-lg text-white">
      <div className="my-[20px] ">
        {/* Add base form */}
        <form
          action=""
          className={
            'bg-gray-800 md:px-6 px-4 py-8 rounded-lg shadow-md mb-6 border border-gray-700'
          }
          onSubmit={handleSubmit(submitBase)}
        >
          <h1 className="font-bold text-lg text-white mb-6">Select product and set price</h1>

          <div className="md:grid md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap- w-full">
            <Controller
              name="productType"
              control={control}
              rules={{ required: "Please select product" }}
              render={({ field }) => (
                <Select
                  label="Product Type"
                  placeholder="Pick product"
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
                    name="price"
                    control={control}
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                     <NumberInput
                        label="Price"
                        labelProps={{ style: { color: "#d1d5db" } }}
                        placeholder="Enter price"
                        min={0}
                        precision={2}
                        error={errors.price?.message}
                        {...field}
                         styles={{ input: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' } }}
                     />
                    )}
                />
            </div>
            <div>
              {loadingBase ? (
                <div className="flex justify-center  items-center mb-1">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <Button
                    type="submit"
                    fullWidth
                    color="blue"
                    className="mb-1"
                >
                  Set Price
                </Button>
              )}
            </div>
          </div>
        </form>
        {/* end of add base form */}

        <div className="flex  justify-start items-center gap-5  my-6 px-1 md:px-4 text-white">
          <h1 className="text-lg font-semibold">All product prices</h1>
         
        </div>
        <div className="overflow-x-auto mb-3 rounded-lg border border-gray-700">
          <table className="w-full text-center table-auto border-collapse border border-gray-700 text-gray-300 text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="border border-gray-700 py-3 px-3">
                  Id
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Product Type
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Price
                </th>
                
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {loadingPrices ? (
                <tr>
                    <td colSpan={3} className="text-center py-6">
                         <PulseLoader color="#6ba54a" size={10} />
                    </td>
                </tr>
              ) : !pricesData?.data || pricesData?.data?.message ||
                pricesData?.data?.length < 1 ? (
                <tr>
                  <td colSpan={3} className="text-gray-400 text-center py-6">
                    No prices found!
                  </td>
                </tr>
              ) : (
                pricesData?.data?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <td className="border border-gray-700 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border border-gray-700 py-2 px-3 font-medium text-white">
                        {productMap[item?.productType] || ""}
                      </td>
                      <td className="border border-gray-700 py-2 px-3 font-bold text-green-400">
                        ${item?.price}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SetProductsPrices
