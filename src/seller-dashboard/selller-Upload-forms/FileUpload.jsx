import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from '../../api/axios';
import { toast } from 'react-toastify'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../../hooks/useAuth'
import filterOptions from '../../pages/filterOptions'


function FileUpload() {
  // selct country value...........
  const [singleFile, setSingleFile] = useState('')

  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId;
  
  // fetching category
  const fetchCategories = () => {
    return axios.get(`/categories/file`)
  }

  const { isLoading: loadingCategories, data: categoriesData } = useQuery(
    [`filesCategory`],
    fetchCategories,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )
  console.log(categoriesData?.data)

  //end of fetching categories------------------

  const SingleFileChange = (e) => {
    const file = e.target.files[0]
    const fileSizeInMB = file.size / (1024 * 1024) // Convert file size to MB
    if (fileSizeInMB > 2) {
      toast.warn('File size exceeds 2MB limit.')
      e.target.value = null // Reset file input element
      return
    }
    setSingleFile(e.target.files[0])
  }

  const options = useMemo(() => countryList().getData(), [])

  
  // ....................

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()

  //   form data........
  const formData = new FormData()
  formData.append('file', singleFile)
  formData.append('country', watch('country'))
  formData.append('category', watch('category'))
  formData.append('sellerId', watch('sellerId'))
  formData.append('state', watch('state'))
  formData.append('price', watch('price'))
  formData.append('description', watch('description'))
  // console.log(formData)

  const [sending, setSending] = useState(false)

  const submitFile = () => {
    setSending(!sending)
    if (singleFile === '') {
      toast.warn('File is required!')
      setSending(false)
      return 0
    }
   
    axios
      .post('/files', formData)
      .then((response) => {
        toast.success(response?.data?.message)
        setSending(false)
        reset()
        setSingleFile('')
      })
      .catch((error) => {
        console.error(error)
        toast.error(error?.response?.data?.message)
        setSending(false)
      })
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
        onSubmit={handleSubmit(submitFile)}
      >
        <h1 className="text-center py-4 px-2">Sell file</h1>

        {/* ALL inputs div */}
        <div className="flex flex-col md:grid md:grid-cols-3  gap-3  ">
          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Category{' '}
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>{' '}
            </label>
            {
              loadingCategories ?
              <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>:

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
            }

            {errors.category && (
              <p className="text-red-500 text-xs">Category is required</p>
            )}
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
              {errors.sellerId?.type === 'required' && 'Seller is required'}
            </p>
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
                    formData.append('state', selectedOption.value)
                  
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
              {' '}
              Country{' '}
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
                  value={options.find(
                    (option) => option.value === field.value,
                  )}
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
              {' '}
              Price{' '}
              <span className="text-red-500 text-xs">
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

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Upload zip file.{' '}
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <input
              type="file"
              accept=".zip"
              className="w-full p-1 outline-none border focus:border-secondary"
              onChange={(event) => {
                SingleFileChange(event)
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">
              {' '}
              Description{' '}
              <span className="text-red-500 text-xs">
                <sup>*</sup>
              </span>
            </label>

            <textarea
              placeholder=" Enter description"
              className="w-full p-1 outline-none border focus:border-secondary"
              {...register('description', {
                required: true,
              })}
            ></textarea>
            <p className="text-red-500 text-xs">
              {errors.description?.type === 'required' &&
                'Description is required'}
            </p>
          </div>
        </div>
        {/* end of inputs div */}

        <div className="flex justify-center my-6 items-center">
          {sending ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary ">
              Upload
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default FileUpload
