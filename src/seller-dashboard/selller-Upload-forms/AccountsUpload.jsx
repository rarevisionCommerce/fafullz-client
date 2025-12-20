import React, { useState, useMemo } from 'react'
import { Select, FileInput, Textarea, NumberInput, Button, Title, Paper, Grid, Loader } from '@mantine/core'
import countryList from 'react-select-country-list'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'
import filterOptions from '../../pages/filterOptions'

function AccountsUpload() {
  const axios = useAxiosPrivate();
  // selct country value...........
  const [singleFile, setSingleFile] = useState(null)
  //   const userId= useAuth?.userId;
  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId

  // fetching category
  const fetchCategories = () => {
    return axios.get(`/categories/account`)
  }

  const { isLoading: loadingCategories, data: categoriesData } = useQuery(
    [`accountsCategory`],
    fetchCategories,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  //end of fetching categories------------------

  const SingleFileChange = (file) => {
    if (file) {
        const fileSizeInMB = file.size / (1024 * 1024) // Convert file size to MB
        if (fileSizeInMB > 2) {
          toast.warn('File size exceeds 2MB limit.')
          setSingleFile(null)
          return
        }
        setSingleFile(file)
    } else {
        setSingleFile(null)
    }
  }

  const options = useMemo(() => countryList().getData(), [])

  // ....................

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm()

  const [sending, setSending] = useState(false)

  const submitAccount = (data) => {
    setSending(true)
    if (!singleFile) {
      toast.warn('File is required!')
      setSending(false)
      return
    }

    const formData = new FormData()
    formData.append('file', singleFile)
    formData.append('country', data.country)
    formData.append('category', data.category)
    formData.append('sellerId', sellerId)
    formData.append('state', data.state)
    formData.append('price', data.price)
    formData.append('description', data.description)

    axios
      .post('/accounts', formData)
      .then((response) => {
        toast.success(response?.data?.message)
        reset()
        setSending(false)
        setSingleFile(null)
      })
      .catch((error) => {
        console.error(error)
        toast.error(error?.response?.data?.message || 'Something went wrong')
        setSending(false)
      })
  }

  const categoriesOptions = [];
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
      <form onSubmit={handleSubmit(submitAccount)}>
        <Title order={3} align="center" mb="lg" color="white">Sell Account</Title>

        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
            <Grid>
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
                    <Controller
                        name="state"
                        control={control}
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                            <Select
                                label={<span className="text-gray-200">State <span className="text-red-500">*</span></span>}
                                placeholder="Select State"
                                data={filterOptions?.state || []}
                                {...field}
                                error={errors.state?.message}
                                searchable
                                styles={{
                                    label: { color: "#d1d5db" },
                                    input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                                    item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                                    dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                                }}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={12} md={4}>
                     <Controller
                        name="country"
                        control={control}
                        rules={{ required: "Country is required" }}
                        render={({ field }) => (
                            <Select
                                label={<span className="text-gray-200">Country <span className="text-red-500">*</span></span>}
                                placeholder="Select Country"
                                data={options}
                                {...field}
                                onChange={(value) => {
                                     const opt = options.find(o => o.value === value);
                                     field.onChange(opt ? opt.label : value);
                                }}
                                value={options.find(o => o.label === field.value)?.value || field.value}
                                error={errors.country?.message}
                                searchable
                                styles={{
                                    label: { color: "#d1d5db" },
                                    input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                                    item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                                    dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                                }}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={12} md={4}>
                    <Controller
                        name="price"
                        control={control}
                        rules={{ required: "Price is required" }}
                        render={({ field }) => (
                            <NumberInput
                                label={<span className="text-gray-200">Price <span className="text-red-500">*</span></span>}
                                placeholder="Price"
                                min={0}
                                {...field}
                                error={errors.price?.message}
                                styles={{
                                    label: { color: "#d1d5db" },
                                    input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                                }}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={12} md={4}>
                     <FileInput
                        label={<span className="text-gray-200">Upload zip file <span className="text-red-500">*</span></span>}
                        placeholder="Select file"
                        accept=".zip"
                        value={singleFile}
                        onChange={SingleFileChange}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                             placeholder: { color: '#9ca3af' }
                        }}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Textarea
                        label={<span className="text-gray-200">Description <span className="text-red-500">*</span></span>}
                        placeholder="Enter description"
                        minRows={3}
                        {...register('description', { required: 'Description is required' })}
                        error={errors.description?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                </Grid.Col>
            </Grid>

            <div className="flex justify-center mt-6">
                 {sending ? (
                    <Loader color="green" size="sm" />
                  ) : (
                    <Button type="submit" color="green" variant="filled">
                      Upload
                    </Button>
                  )}
            </div>
        </Paper>
      </form>
    </div>
  )
}

export default AccountsUpload
