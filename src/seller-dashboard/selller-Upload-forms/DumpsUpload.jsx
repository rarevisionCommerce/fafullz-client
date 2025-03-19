import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../../hooks/useAuth'
import filterOptions from '../../pages/filterOptions'
import DatePicker from 'react-datepicker'




function DumpsUpload() {
    const axios = useAxiosPrivate();
  // selct country value...........
  const [countryValue, setCountryValue] = useState(null)
  const [singleFile, setSingleFile] = useState('')
  const [noCoutry, setNoCountry] = useState('')
  // seller id from auth
    const {auth} = useAuth();
    const sellerId = auth?.jabberId;

   const options = useMemo(() => countryList().getData(), [])

  const countryHandler = (countryValue) => {
    setCountryValue(countryValue.label);
  }
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
  if(countryValue === null ){
    setNoCountry("Please Select Country!");
    setTimeout(() => {
        setNoCountry("");
      }, 15000);
    return 0;
  };
data.country = countryValue;  

  console.log(data)
   dumpMutate(data);
  };
    


  return (
    <div>

        <form action="" className='w-full px-2  ' onSubmit={handleSubmit(submitDump)}>
            <h1 className='text-center py-4 px-2'>Sell dumps</h1>

            {/* ALL inputs div */}
            <div className='flex flex-col md:grid md:grid-cols-3  gap-3  ' >
               

                <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Bin <span className='text-red-500'><sup>*</sup></span> </label>

                    <input type="number" className='w-full p-1 outline-none border focus:border-secondary' 
                    
                    {...register('bin', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.bin?.type === 'required' && 'Bin is required'}
            </p>

                </div>
                   <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Track 1  <span className='text-red-500'><sup>*</sup></span> </label>

                    <input type="text" className='w-full p-1 outline-none border focus:border-secondary' 
                    
                    {...register('track1')}
            />
           

                </div> 
                 <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Track 2  <span className='text-red-500'><sup>*</sup></span> </label>

                    <input type="text" className='w-full p-1 outline-none border focus:border-secondary' 
                    
                    {...register('track2', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.track2?.type === 'required' && 'Track 2 is required'}
            </p>

                </div> 

                <div className='flex flex-col gap-2'>
                    <label htmlFor=""> EXP <span className='text-red-500'><sup>*</sup></span> </label>

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
                <div className='flex flex-col gap-2'>
                    <label htmlFor=""> SVC <span className='text-red-500'><sup>*</sup></span> </label>

                    <input type="number" className='w-full p-1 outline-none border focus:border-secondary' 
                    
                       {...register('svc', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.svc?.type === 'required' && 'Svc is required'}
            </p>

                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Bank <span className='text-red-500'><sup>*</sup></span> </label>

                    <input type="text" className='w-full p-1 outline-none border focus:border-secondary' 
                    
                       {...register('bank', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs">
              {errors.bank?.type === 'required' && 'Bank is required'}
            </p>

                </div>  
                <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Country <span className='text-red-500'><sup>*</sup></span> </label>

                     <Select
              options={options}
              countryValue={countryValue}
              onChange={countryHandler}
              
            />
            <h1 className='text-red-500 text-xs'>{noCoutry}</h1>


                </div>  

                 <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Type <span className='text-red-500'><sup>*</sup></span> </label>

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

                 <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Level <span className='text-red-500'><sup>*</sup></span> </label>

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

              
    
                 <div className='hidden flex-col gap-2'>
                    <label htmlFor=""> sellerId <span className='text-red-500'><sup>*</sup></span> </label>

                    <input type="text" value={sellerId}  className='w-full p-1 outline-none border focus:border-secondary' 
                    {...register('sellerId', {
                required: true,
              })}
            />
            <p className="text-red-500 text-xs" >
              {errors.sellerId?.type === 'required' && 'Seller Id is required'}
            </p>

                </div>

                 <div className='flex flex-col gap-2'>
                    <label htmlFor=""> Price <span className='text-red-500'><sup>*</sup></span></label>

                    <input type="number" min={0} className='w-full p-1 outline-none border focus:border-secondary' 
                    
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

            <div className='flex justify-center my-6 items-center'>
                <button className='bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary '>Upload</button>
            </div>

        </form>

    </div>
  )
}

export default DumpsUpload