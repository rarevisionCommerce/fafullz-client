import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import useAuth from '../../hooks/useAuth';
import filterOptions from '../../pages/filterOptions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function CardsUpload() {
    const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId;



  //   country options
  const options = useMemo(() => countryList().getData(), [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()
  const binInput = watch('ccnum')?.substr(0,6) || "";

  // upload function
  const uploadCard = (ssnData) => {
    return axios.post('/cards', ssnData)
  }

  const { mutate: cardMutate, isLoading: cardLoading, error } = useMutation(
    uploadCard,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message)
        reset()
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message)

        if (!err.response.data.message) {
          toast.error('something went wrong')
        }
      },
    },
  )

  const submitCard = (data) => {
    console.log(data)
    cardMutate(data)
  }

  return (
    <div>
      <form
        action=""
        className="w-full px-2  "
        onSubmit={handleSubmit(submitCard)}
      >
        <h1 className="text-center py-4 px-2">Sell cards</h1>

        {/* ALL inputs div */}
        <div className="flex flex-col md:grid md:grid-cols-3  gap-3  ">
           <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              CC Number{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <input
              type="number"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('ccnum', {
                required: true,
                minLength:6,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.ccnum?.type === 'required' && 'CC number  is required'}
              {errors.ccnum?.type === 'minLength' && 'CC number  must be more than 6 digits'}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Bin{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <input
              type="number"
              className="w-full  p-1 outline-none border focus:border-secondary"  
              value={binInput}
            disabled
            />
          
          </div>
         
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              CVV{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <input
              type="number"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('cvv', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.cvv?.type === 'required' && 'Cvv is required'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Bank
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('bank', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.bank?.type === 'required' && 'Bank is required'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Type{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="type"
                  options={filterOptions?.cardsType}
                  value={filterOptions?.cardsType?.find(
                    (option) => option.value === field.value,
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value)
                  }}
                />
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-xs">Type is required</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Class{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <Controller
              name="classz"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="classz"
                  options={filterOptions?.cardsClass}
                  value={filterOptions?.cardsClass?.find(
                    (option) => option.value === field.value,
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value)
                  }}
                />
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-xs">Class is required</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Level{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <Controller
              name="level"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="level"
                  options={filterOptions?.cardsLevel}
                  value={filterOptions?.cardsLevel?.find(
                    (option) => option.value === field.value,
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value)
                  }}
                />
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-xs">Level is required</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">Exp</label>
            <Controller
              control={control}
              name="exp"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="border rounded py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              )}
              rules={{ required: true }}
              defaultValue={null}
            />
             <p className="text-red-500 text-xs">
              {errors.exp?.type === 'required' && 'Exp is required'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              Country
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="country"
                  options={options}
                  value={options.find((option) => option.value === field.value)}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.label)
                  }}
                />
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-xs">Please select country</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              State
              <span className="text-red-500 text-xs">
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
            <label htmlFor=""> City </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('city', {})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Name{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>{' '}
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('name', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.name?.type === 'required' && 'Name is required'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Address{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('address', { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.address?.type === 'required' && 'Address is required'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              zip{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('zip', { required: true })}
            />
            <p className="text-red-500 text-xs">
              {errors.zip?.type === 'required' && 'Zip is required'}
            </p>
          </div>
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
            <label htmlFor="">
              Phone
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="number"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('phone', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.phone?.type === 'required' && 'Phone is required'}
            </p>
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
            <label htmlFor=""> DOB </label>

            <input
              type="date"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('dob')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor=""> SSN </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('ssn')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">DL</label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('dl')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">MMN</label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('mmn')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor=""> IP </label>

            <input
              type="text"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('ip')}
            />
          </div>
          <div className="flex-col hidden gap-2">
            <label htmlFor="">
              {' '}
              sellerId{' '}
              <span className="text-red-500">
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
              {errors.sellerId?.type === 'required' && 'Seller Id is required'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Price{' '}
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="number"
              min={0}
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('price', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.price?.type === 'required' && 'Price is required'}
            </p>
          </div>
        </div>
        {/* end of inputs div */}

        <div className="flex justify-center my-6 items-center">
          {cardLoading ? (
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
                to={'/seller-dash/card-csv-upload'}
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

export default CardsUpload
