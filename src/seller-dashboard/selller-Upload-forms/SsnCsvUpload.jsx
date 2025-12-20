import React, { useState, useMemo } from 'react'
import { Select, FileInput, Button, Title, Paper, Grid, Loader, Alert, Text, Anchor } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'

function SsnCsvUpload() {
  const {auth} = useAuth()
  const sellerId = auth?.jabberId;
  const axios = useAxiosPrivate();
  const [singleFile, setSingleFile] = useState(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm()

  //get all bases
  const getBases = () => {
    return axios.get(`/bases`)
  }

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ['bases-'],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )
  
  // making base optopns
  const baseOptions = []
  if(basesData?.data?.bases){
    basesData.data.bases.forEach((base) => {
        baseOptions.push({
        label: base.base,
        value: base.base, // Using base name as value to match logic in other components or original if needed? 
        // Original code used base._id as value but appended base.label as 'base' and base.value (id) as 'price'.
        // Let's keep original logic: label=base.name, value=base._id
        original: base
        })
    })

    // To make Mantine Select work well, 'value' should be string. _id is string.
  }

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

  const [sending, setSending] = useState(false)

  const submitFile = (data) => {
    setSending(true)
    if (!singleFile) {
      toast.warn('Please upload csv file!')
      setSending(false)
      return
    }

    // Find selected base object to get price/id
    const selectedBase = basesData?.data?.bases?.find(b => b._id === data.base);
    
    const formData = new FormData()
    formData.append('file', singleFile);
    formData.append('base', selectedBase ? selectedBase.base : '');
    formData.append('price', selectedBase ? selectedBase._id : ''); // appeding ID as price per original logic? 
    // Original: formData.append('price', base?.value); where base was the select option object {label, value:_id}
    formData.append('sellerId', sellerId);

    axios
      .post('csv/ssn', formData)
      .then((response) => {
        toast.success(response?.data?.message)
        setSending(false)
        reset()
        setSingleFile(null)
      })
      .catch((error) => {
        console.error(error)
        toast.error(error?.response?.data?.message || 'Something went wrong')
        setSending(false)
      })
  }

const handleDownload = async () => {
    const response = await fetch('https://api.fafullz.com/uploads/ssnCsv.csv');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-ssncsv.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const mantineBaseOptions = baseOptions.map(b => ({ label: b.label, value: b.original._id }));

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(submitFile)}>
        <Title order={3} align="center" mb="lg" color="white">Upload SSN CSV</Title>
        
        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }} mb="lg">
             <Alert icon={<IconInfoCircle size="1rem" />} title="Upload instructions!" color="orange" variant="filled" mb="md">
                <Text size="sm">Ensure your columns include the following fields and are named as follows:</Text>
                <Text size="sm" weight={700} my="xs">firstName,lastName,country,state,zip,dob,address,ssn,cs,city,description</Text>
                <Button 
                    variant="white" 
                    color="dark" 
                    size="xs" 
                    onClick={handleDownload} 
                    mt="xs"
                    compact
                >
                    Download sample
                </Button>
            </Alert>

             <Grid>
                 <Grid.Col span={12} md={6}>
                    {loadingBases ? (
                        <div className="flex items-end h-full pb-2">
                             <Loader size="sm" color="green" />
                        </div>
                    ) : (
                         <Controller
                            name="base"
                            control={control}
                            rules={{ required: "Base is required" }}
                            render={({ field }) => (
                                <Select
                                    label={<span className="text-gray-200">Base <span className="text-red-500">*</span></span>}
                                    placeholder="Select Base"
                                    data={mantineBaseOptions}
                                    {...field}
                                    error={errors.base?.message}
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

                 <Grid.Col span={12} md={6}>
                     <FileInput
                        label={<span className="text-gray-200">CSV file <span className="text-red-500">*</span></span>}
                        placeholder="Select CSV file"
                        accept=".csv"
                        value={singleFile}
                        onChange={SingleFileChange}
                        required
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                            placeholder: { color: '#9ca3af' }
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

export default SsnCsvUpload
