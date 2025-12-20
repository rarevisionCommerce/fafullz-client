import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import filterOptions from "../../pages/filterOptions";
import { Link } from "react-router-dom";
import { Select, TextInput, Button, Title, Paper, Grid, Loader } from '@mantine/core';
import countryList from "react-select-country-list";

function SsnUpload() {
  const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth();
  const sellerId = auth?.jabberId;
  //get all bases
  const getBases = () => {
    return axios.get(`/bases`);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ["bases-"],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );
  // making base optopns
  const baseOptions = [];

  basesData?.data?.bases?.map((base, index) => {
    baseOptions.push({
      label: base.base,
      value: base.base,
      original: base // Store original base object to access _id later
    });
  });
  //end...........
  const baseValue = watch("baseData");
  
  // Find the selected base object based on the selected value
  const selectedBase = basesData?.data?.bases?.find(b => b.base === baseValue);

  //   country options
  const options = useMemo(() => countryList().getData(), []);

  // upload function
  const uploadSsn = (ssnData) => {
    return axios.post("/ssn", ssnData);
  };

  const { mutate: ssnMutate, isLoading: ssnLoading, error } = useMutation(
    uploadSsn,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message;
        toast.error(text);

        if (!err.response.data.message) {
          toast.error("something went wrong");
        }
      },
    }
  );

  const submitSsn = (data) => {
    // data.baseData is the value from the select, which is base.base
    // We need to set data.base and data.price
    if (selectedBase) {
        data.base = selectedBase.base;
        data.price = selectedBase._id;
    }
    // Remove baseData from submission if needed, or backend ignores it
    delete data.baseData;
    
    ssnMutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(submitSsn)}>
        <Title order={3} align="center" mb="lg" color="white">Sell SSN/DOB</Title>

        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
            <Grid>
                 <Grid.Col span={12} md={4}>
                    <Controller
                        name="baseData"
                        control={control}
                        rules={{ required: "Base is required" }}
                        render={({ field }) => (
                            <Select
                                label={<span className="text-gray-200">Base <span className="text-red-500">*</span></span>}
                                placeholder="Select Base"
                                data={baseOptions}
                                {...field}
                                error={errors.baseData?.message}
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
                        label={<span className="text-gray-200">First Name <span className="text-red-500">*</span></span>}
                        placeholder="First Name"
                        {...register("firstName", { required: "First name is required" })}
                        error={errors.firstName?.message}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Last Name <span className="text-red-500">*</span></span>}
                        placeholder="Last Name"
                         {...register("lastName", { required: "Last name is required" })}
                        error={errors.lastName?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        type="date"
                        label={<span className="text-gray-200">DOB <span className="text-red-500">*</span></span>}
                         {...register("dob", { required: "DOB is required" })}
                        error={errors.dob?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151', colorScheme: 'dark' } 
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">SSN <span className="text-red-500">*</span></span>}
                        placeholder="SSN"
                         {...register("ssn", { required: "SSN is required" })}
                        error={errors.ssn?.message}
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
                                     // react-select-country-list uses code as value, label as label. 
                                     // Mantine select passes value. 
                                     // Existing logic used `selectedOption.label`.
                                     // Assuming options format is correct for Mantine (value, label).
                                     // Let's ensure we find the label corresponding to value if needed, 
                                     // or just pass the value if backend accepts it.
                                     // Previous code: field.onChange(selectedOption.label);
                                     // We should probably stick to label if existing logic did that.
                                     const opt = options.find(o => o.value === value);
                                     field.onChange(opt ? opt.label : value);
                                }}
                                // We need to handle value binding correctly since we store Label but Select expects Value presumably
                                // Actually options from countryList().getData() are {value: 'US', label: 'United States'}
                                // If form stores 'United States', we need to map back to 'US' for the Select 'value' prop if we want it controlled properly
                                // But mapping back by label is tricky if duplicates exist. 
                                // Let's try to just store the label as before. 
                                // Ideally we should store value, but to minimize backend break:
                                // If field.value is 'United States', we need to find the option with label 'United States' and pass its value to Select.
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
                        label={<span className="text-gray-200">City <span className="text-red-500">*</span></span>}
                        placeholder="City"
                         {...register("city", { required: "City is required" })}
                        error={errors.city?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Zip <span className="text-red-500">*</span></span>}
                         placeholder="Zip Code"
                         {...register("zip", { required: "Zip is required" })}
                        error={errors.zip?.message}
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
                         {...register("address", { required: "Address is required" })}
                        error={errors.address?.message}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">CS</span>}
                         type="number"
                         min={0}
                        placeholder="CS"
                         {...register("cs")}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                  <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Email</span>}
                         type="email"
                        placeholder="Email"
                         {...register("email")}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                     <TextInput
                        label={<span className="text-gray-200">Email Pass</span>}
                        placeholder="Email Password"
                         {...register("emailPass")}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">FA Uname</span>}
                        placeholder="FA Username"
                         {...register("faUname")}
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">FA Pass</span>}
                        placeholder="FA Password"
                         {...register("faPass")}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Backup Code</span>}
                        placeholder="Backup Code"
                         {...register("backupCode")}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Security Q&A</span>}
                        placeholder="Security Q&A"
                         {...register("securityQa")}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Description <span className="text-red-500">*</span></span>}
                        placeholder="Description"
                         {...register("description")}
                         styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
                        }}
                    />
                 </Grid.Col>

                 <Grid.Col span={12} md={4}>
                    <TextInput
                        label={<span className="text-gray-200">Price <span className="text-red-500">*</span></span>}
                         value={`$${selectedBase?.price || 0}`}
                        disabled
                        styles={{
                            label: { color: "#d1d5db" },
                            input: { backgroundColor: '#374151', color: 'white', borderColor: '#374151', cursor: 'not-allowed' }
                        }}
                    />
                 </Grid.Col>
            </Grid>
           
           <div className="flex justify-center mt-6 items-center">
             {ssnLoading ? (
               <Loader color="green" size="sm" />
             ) : (
                <div className="flex gap-4 items-center">
                    <Button type="submit" color="green" variant="filled">
                        Upload
                    </Button>
                    <span className="text-gray-300">or</span>
                    <Link to={"/seller-dash/ssn-csv-upload"} className="text-blue-400 hover:text-blue-300 underline">
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

export default SsnUpload;
