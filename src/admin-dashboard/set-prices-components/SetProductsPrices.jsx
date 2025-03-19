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
        toast.success(response?.data?.message)
        queryClient.invalidateQueries([`prices-`])
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
    <div className="bg-light px-3 py-3">
      <div className="my-[20px] ">
        {/* Add base form */}
        <form
          action=""
          className={
            'bg-gray-100 md:px-4 px-2 py-3 min-h-[150px] shadow-md mb-2'
          }
          onSubmit={handleSubmit(submitBase)}
        >
          <h1 className="font-bold text-md">Select product and set price</h1>

          <div className="md:grid  md:grid-cols-3  gap-3 my-3 ">
            <div className="flex flex-col gap- w-full">
            <label htmlFor="">              
              Product Type
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
              <h1>Price</h1>
              <input
                type="number"
                min={0}
                step="any"
                className="border-2 w-full rounded-md py-[6px]  px-2 outline-none  focus:border-gray-700 focus:border-[1px] "
                {...register('price', {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.price?.type === 'required' && 'Price is required'}
              </p>
            </div>
            <div>
              {loadingBase ? (
                <div className="flex justify-center  items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <button className="bg-primary  ml-7 mt-7 text-white rounded-md px-5 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300">
                  Set Price
                </button>
              )}
            </div>
          </div>
        </form>
        {/* end of add base form */}

        <div className="flex  justify-start items-center gap-5  my-6 px-1 md:px-4 ">
          <h1 className="text-lg font-semibold">All product prices</h1>
         
        </div>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Product Type
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Price
                </th>
                
              </tr>
            </thead>

            <tbody className="text-dark">
              {loadingPrices ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !pricesData?.data || pricesData?.data?.message ||
                pricesData?.data?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No prices found!
                  </td>
                </tr>
              ) : (
                pricesData?.data?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {productMap[item?.productType] || ""}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
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
