import React from 'react'
import filterOptions from '../../pages/filterOptions'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../../hooks/useAuth'

function GoogleVoiceUpload() {
    const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

    //   fetching gvoice price 
    const getPrice = () => {
    const productType = "gVoice"
    return axios.get(`/prices/one/${productType}`)
  }
  const { isLoading: loadingPrice, data: priceData } = useQuery(
    [`price-`],
    getPrice,
    {
    },
  )
  // end..............
  const productTypeId = priceData?.data?._id;

  // upload function
  const uploadGoogleVoice = (gVoice) => {
    return axios.post('/gvoices', gVoice)
  }

  const {
    mutate: googleVoiceMutate,
    isLoading: googleVoiceLoading,
    error,
  } = useMutation(uploadGoogleVoice, {
    onSuccess: (response) => {
      toast.success(response?.data?.message)
      reset()
    },
    onError: (err) => {
      const text = err?.response?.data?.message
      toast.error(text)

      if (!err.response.data.message) {
        toast.error('something went wrong')
      }
    },
  })

  const submitGVoice = (data) => {
    data.price = productTypeId;
    googleVoiceMutate(data)
  }
  return (
    <div>
      <form
        action=""
        className="w-full px-2  "
        onSubmit={handleSubmit(submitGVoice)}
      >
        <h1 className="text-center py-4 px-2">Sell GoogleVoice</h1>

        {/* ALL inputs div */}
        <div className="flex flex-col md:grid md:grid-cols-3  gap-3 min-h-[200px] ">
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Email
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="email"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('email', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.email?.type === 'required' && 'Email is required'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Recovery Email</label>

            <input
              type="email"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('recoveryMail')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              State
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="state"
                  options={filterOptions?.state}
                  value={filterOptions?.state?.find(
                    (option) => option.value === field.value,
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value)
                  }}
                />
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-xs">Please select state</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Password
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('password', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.password?.type === 'required' && 'Password is required'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Price
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              value={priceData?.data?.price}
              disabled
              className="w-full p-1 outline-none border cursor-not-allowed bg-gray-200 focus:border-secondary"
              
            />
           
          </div>
          <div className="hidden flex-col gap-2">
            <label htmlFor="">
              sellerId
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              value={sellerId}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('sellerId', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.sellerId?.type === 'required' && 'Seller id is required'}
            </p>
          </div>
        </div>
        {/* end of inputs div */}
        <div className="flex justify-center my-6 items-center">
          {googleVoiceLoading ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <button className={!productTypeId ? "hidden" : "bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary "}>
              Upload
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default GoogleVoiceUpload
