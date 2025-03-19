import React from 'react'
import filterOptions from '../../pages/filterOptions'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

function TextNowUpload() {
    const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId

  // fetching category
  const fetchCategories = () => {
    return axios.get(`/categories/mail`)
  }

  const { isLoading: loadingCategories, data: categoriesData } = useQuery(
    [`mailCategory`],
    fetchCategories,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )
  //   fetching text price
  const getPrice = () => {
    const productType = 'mail'
    return axios.get(`/prices/one/${productType}`)
  }
  const { isLoading: loadingPrice, data: priceData } = useQuery(
    [`price-`],
    getPrice,
    {},
  )
  // end..............
  const productTypeId = priceData?.data?._id

  //end of fetching categories------------------

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()

  //   upload function
  const uploadMail = (mailData) => {
    return axios.post('/mails', mailData)
  }

  const { mutate: mailMutate, isLoading: mailLoading, error } = useMutation(
    uploadMail,
    {
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
    },
  )

  const submitMail = (data) => {
    data.price = productTypeId
    mailMutate(data)
  }
  const categoriesOptions = []
  categoriesData?.data?.categories?.map((item, index) => {
    categoriesOptions.push({
      label: item.category,
      value: item.category,
    })
  })

  return (
    <div>
      <form
        action=""
        className="w-full px-2  "
        onSubmit={handleSubmit(submitMail)}
      >
        <h1 className="text-center py-4 px-2">Sell textnow/mail</h1>

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
              {' '}
              Category{' '}
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>{' '}
            </label>
            {loadingCategories ? (
              <div className="flex justify-center pr-6 items-center">
                <PulseLoader color="#6ba54a" size={10} />
              </div>
            ) : (
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="category"
                    options={categoriesOptions}
                    value={categoriesOptions?.find(
                      (option) => option.value === field.value,
                    )}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption.value)
                    }}
                  />
                )}
              />
            )}

            {errors.category && (
              <p className="text-red-500 text-xs">Category is required</p>
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
              {' '}
              sellerId{' '}
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>{' '}
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
           {mailLoading ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <div className="flex gap-4">
              <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary ">
                Upload
              </button>
              or
              <Link
                to={'/seller-dash/mail-csv-upload'}
                className="cursor-pointer underline  "
              >
                Upload CSV
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default TextNowUpload
