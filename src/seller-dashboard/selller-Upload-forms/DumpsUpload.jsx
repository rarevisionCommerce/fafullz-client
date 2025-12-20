import React, { useState, useMemo } from 'react'
import { Select, TextInput, NumberInput, Button, Title, Paper, Grid, Loader } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import countryList from 'react-select-country-list'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'
import filterOptions from '../../pages/filterOptions'



function DumpsUpload() {
    const axios = useAxiosPrivate();
  // selct country value...........
  const [countryValue, setCountryValue] = useState(null)

  // seller id from auth
    const {auth} = useAuth();
    const sellerId = auth?.jabberId;

   const options = useMemo(() => countryList().getData(), [])

  // ....................

  // use form 
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control
  } = useForm()


 // upload function
  const uploadDump = (dumpData) => {
    return axios.post("/dumps", dumpData);
  };


  const {
    mutate: dumpMutate,
    isLoading: dumpLoading,
    error,
  } = useMutation(uploadDump, {

    onSuccess: (response) => {
      toast.success(response?.data?.message);
       reset();  
       setCountryValue(null);
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
       toast.error(text)

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });



const submitDump = (data) => {
//   if(!data.country){ // handled by required rule in Controller now
//     toast.error("Please Select Country!");
//     return;
//   };
  // data.country = countryValue; // already in data if using Controller

  console.log(data)
   dumpMutate(data);
  };
    


  return (
    <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(submitDump)}>
            <Title order={3} align="center" mb="lg" color="white">Sell Dumps</Title>

            <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
                 <Grid>
                    <Grid.Col span={12} md={4}>
                        <TextInput
                            label={<span className="text-gray-200">Bin <span className="text-red-500">*</span></span>}
                            placeholder="Bin"
                            type="number"
                            {...register('bin', { required: 'Bin is required' })}
                            error={errors.bin?.message}
                            styles={{
                                label: { color: "#d1d5db" },
                                input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={12} md={4}>
                        <TextInput
                            label={<span className="text-gray-200">Track 1 <span className="text-red-500">*</span></span>}
                            placeholder="Track 1"
                            {...register('track1')}
                             styles={{
                                label: { color: "#d1d5db" },
                                input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={12} md={4}>
                        <TextInput
                            label={<span className="text-gray-200">Track 2 <span className="text-red-500">*</span></span>}
                            placeholder="Track 2"
                            {...register('track2', { required: 'Track 2 is required' })}
                            error={errors.track2?.message}
                            styles={{
                                label: { color: "#d1d5db" },
                                input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={12} md={4}>
                        <Controller
                            control={control}
                            name="exp"
                            rules={{ required: "Exp is required" }}
                            render={({ field }) => (
                                <DateInput
                                    label={<span className="text-gray-200">EXP <span className="text-red-500">*</span></span>}
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
                         <TextInput
                            label={<span className="text-gray-200">SVC <span className="text-red-500">*</span></span>}
                            placeholder="SVC"
                            type="number"
                             {...register('svc', { required: 'SVC is required' })}
                            error={errors.svc?.message}
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

                    <Grid.Col span={12} md={4} style={{ display: 'none' }}>
                        <TextInput value={sellerId} {...register('sellerId', { required: true })} />
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
                 </Grid>

                <div className="flex justify-center mt-6 items-center">
                    {dumpLoading ? (
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

export default DumpsUpload