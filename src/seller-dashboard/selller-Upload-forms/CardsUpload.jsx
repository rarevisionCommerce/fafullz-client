import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Select, TextInput, Button, Title, Paper, Grid, Loader, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import countryList from 'react-select-country-list';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import filterOptions from '../../pages/filterOptions';

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
    // data.exp comes as Date object from DateInput
    // Format it to MM/YYYY or whatever backend expects if needed.
    // Existing backend likely expects string, let's check what existing code did:
    // It used react-datepicker which returns a Date object usually, which react-hook-form handles.
    // If backend expects string, axios serializes date.
    // Let's ensure format is correct.
    console.log(data)
    cardMutate(data)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(submitCard)}>
        <Title order={3} align="center" mb="lg" color="white">Sell Cards</Title>

        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
            <Grid>
                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">CC Number <span className="text-red-500">*</span></span>}
                        placeholder="CC Number"
                        type="number"
                        {...register('ccnum', { required: 'CC number is required', minLength: { value: 6, message: 'CC number must be more than 6 digits' } })}
                        error={errors.ccnum?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Bin <span className="text-red-500">*</span></span>}
                        value={binInput}
                        disabled
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#374151', color: 'white', borderColor: '#374151', cursor: 'not-allowed' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">CVV <span className="text-red-500">*</span></span>}
                        placeholder="CVV"
                        type="number"
                        {...register('cvv', { required: 'CVV is required' })}
                        error={errors.cvv?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Bank <span className="text-red-500">*</span></span>}
                        placeholder="Bank"
                        {...register('bank', { required: 'Bank is required' })}
                        error={errors.bank?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                            <Select
                                label={<span className="text-gray-200">Type <span className="text-red-500">*</span></span>}
                                placeholder="Select Type"
                                data={filterOptions?.cardsType || []}
                                {...field}
                                error={errors.type?.message}
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
                        name="classz"
                        control={control}
                        rules={{ required: "Class is required" }}
                        render={({ field }) => (
                            <Select
                                label={<span className="text-gray-200">Class <span className="text-red-500">*</span></span>}
                                placeholder="Select Class"
                                data={filterOptions?.cardsClass || []}
                                {...field}
                                error={errors.classz?.message}
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
                        name="level"
                        control={control}
                        rules={{ required: "Level is required" }}
                        render={({ field }) => (
                            <Select
                                label={<span className="text-gray-200">Level <span className="text-red-500">*</span></span>}
                                placeholder="Select Level"
                                data={filterOptions?.cardsLevel || []}
                                {...field}
                                error={errors.level?.message}
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
                        name="exp"
                        control={control}
                        rules={{ required: "Exp is required" }}
                        render={({ field }) => (
                            <DateInput
                                label={<span className="text-gray-200">Exp <span className="text-red-500">*</span></span>}
                                placeholder="MM/YYYY"
                                valueFormat="MM/YYYY"
                                {...field}
                                error={errors.exp?.message}
                                styles={{
                                    label: { color: "#d1d5db" },
                                    input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                                    calendar: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }, 
                                    monthLevelGroup: { backgroundColor: '#1f2937' },
                                    decadeLevelGroup: { backgroundColor: '#1f2937' },
                                     day: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' }, color: 'white' }
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
                        label={<span className="text-gray-200">City</span>}
                        placeholder="City"
                        {...register('city')}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Name <span className="text-red-500">*</span></span>}
                        placeholder="Name"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Address <span className="text-red-500">*</span></span>}
                        placeholder="Address"
                        {...register('address', { required: 'Address is required' })}
                        error={errors.address?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Zip <span className="text-red-500">*</span></span>}
                        placeholder="Zip"
                        {...register('zip', { required: 'Zip is required' })}
                        error={errors.zip?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Email <span className="text-red-500">*</span></span>}
                        placeholder="Email"
                        type="email"
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
                        label={<span className="text-gray-200">Phone <span className="text-red-500">*</span></span>}
                        placeholder="Phone"
                        type="number"
                        {...register('phone', { required: 'Phone is required' })}
                        error={errors.phone?.message}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
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
                        type="date"
                        label={<span className="text-gray-200">DOB</span>}
                        {...register('dob')}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151', colorScheme: 'dark' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">SSN</span>}
                        placeholder="SSN"
                        {...register('ssn')}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">DL</span>}
                        placeholder="DL"
                        {...register('dl')}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">MMN</span>}
                        placeholder="MMN"
                        {...register('mmn')}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">IP</span>}
                        placeholder="IP"
                        {...register('ip')}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Price <span className="text-red-500">*</span></span>}
                        placeholder="Price"
                        type="number"
                        min={0}
                        {...register('price', { required: 'Price is required' })}
                        error={errors.price?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4} style={{ display: 'none' }}>
                    <TextInput
                         value={sellerId}
                         {...register('sellerId', { required: true })}
                    />
                 </Grid.Col>
            </Grid>
           
           <div className="flex justify-center mt-6 items-center">
             {cardLoading ? (
               <Loader color="green" size="sm" />
             ) : (
                <div className="flex gap-4 items-center">
                    <Button type="submit" color="green" variant="filled">
                        Upload
                    </Button>
                    <span className="text-gray-300">or</span>
                    <Link to={"/seller-dash/card-csv-upload"} className="text-blue-400 hover:text-blue-300 underline">
                        Upload CSV
                    </Link>
                </div>
             )}
           </div>
        </Paper>
      </form>
    </div>
  );
}

export default CardsUpload;
