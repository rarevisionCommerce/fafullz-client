import React from 'react'
import { Select, TextInput, Button, Title, Paper, Grid, Loader } from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
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
  if (categoriesData?.data?.categories) {
    categoriesData.data.categories.forEach((item) => {
        categoriesOptions.push({
            label: item.category,
            value: item.category,
        })
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(submitMail)}>
        <Title order={3} align="center" mb="lg" color="white">Sell TextNow/Mail</Title>

        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
            <Grid>
                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Email <span className="text-red-500">*</span></span>}
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email?.message}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Recovery Email</span>}
                        placeholder="Recovery Email"
                        {...register('recoveryMail')}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                     {loadingCategories ? (
                        <div className="flex items-end h-full pb-2">
                             <Loader size="sm" color="green" />
                        </div>
                     ) : (
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select
                                    label={<span className="text-gray-200">Category <span className="text-red-500">*</span></span>}
                                    placeholder="Select Category"
                                    data={categoriesOptions}
                                    {...field}
                                    error={errors.category?.message}
                                    styles={{
                                        label: { color: "#d1d5db" },
                                        input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                                        item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                                        dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                                    }}
                                />
                            )}
                        />
                     )}
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Password <span className="text-red-500">*</span></span>}
                        placeholder="Password"
                        {...register('password', { required: 'Password is required' })}
                        error={errors.password?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Price <span className="text-red-500">*</span></span>}
                         value={priceData?.data?.price || 0}
                        disabled
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#374151', color: 'white', borderColor: '#374151', cursor: 'not-allowed' }
                        }}
                    />
                 </Grid.Col>
            </Grid>
            
            <div className="flex justify-center mt-6 items-center">
              {mailLoading ? (
                <Loader color="green" size="sm" />
              ) : (
                <div className="flex gap-4 items-center">
                  <Button type="submit" color="green" variant="filled">
                    Upload
                  </Button>
                  <span className="text-gray-300">or</span>
                  <Link
                    to={'/seller-dash/mail-csv-upload'}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Upload CSV
                  </Link>
                </div>
              )}
            </div>
        </Paper>
      </form>
    </div>
  )
}

export default TextNowUpload
