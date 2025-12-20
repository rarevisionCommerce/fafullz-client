import React from 'react'
import filterOptions from '../../pages/filterOptions'
import { Select, TextInput, Button, Title, Paper, Grid, Loader } from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
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
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(submitGVoice)}>
        <Title order={3} align="center" mb="lg" color="white">Sell GoogleVoice</Title>

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

            {/* Validation for price loading or existence could be handled here showing a loader or message */}

             <div className="flex justify-center my-6 items-center">
                {googleVoiceLoading ? (
                    <Loader color="green" size="sm" />
                ) : (
                    <Button 
                        type="submit" 
                        color="green" 
                        variant="filled"
                        disabled={!productTypeId}
                    >
                        Upload
                    </Button>
                )}
            </div>
        </Paper>
      </form>
    </div>
  )
}

export default GoogleVoiceUpload
