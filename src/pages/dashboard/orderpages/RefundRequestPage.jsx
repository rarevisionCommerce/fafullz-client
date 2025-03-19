import React from 'react'
import { useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../../../hooks/useAuth'

function RefundRequestPage() {
  // use form
  const { auth } = useAuth()
  const userId = auth?.userId;
    const axios = useAxiosPrivate();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()

  const { productId, productType } = useParams();
// get the product
const fetchProduct = () => {
    return axios.get(
      `/refunds/product/${productType}/${productId}`
    );
  };

  const {
    isLoading: loadingProduct,
    data: productData,
    refetch,
    isRefetching: refetchingProduct,
  } = useQuery(["product", productId], fetchProduct, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });


  //send request
  // get address function
  const sendRequest = (refund) => {
    return axios.post('/refunds', refund)
  }
  const {
    mutate: refundMutate,
    isLoading: refundLoading,
    error,
  } = useMutation(sendRequest, {
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



const submitRequest = (data) => {
   data.productType = productType;
   data.productId = productId;
   data.amount = productData?.data?.price?.price;
   data.buyerId = userId;
   data.userName = auth?.userName;

    refundMutate(data);
  };
  return (
    <div className="bg-light px-3 py-2 min-h-[400px]">
      <h1 className="text-lg font-bold text-center">Request Refund </h1>
      <div className="my-3 bg-gray-100 p-2 shadow-sm">
        <h1 className="mb-2 font-bold ">Product Details:</h1>

        <div className="flex gap-2 ">
          <h1 className="font-semibold">Email:</h1>
          <h1>{productData?.data?.email}</h1>
        </div>

        <div className="flex gap-2 my-2">
          <h1 className="font-semibold">Recovery Email:</h1>
          <h1>{productData?.data?.recoveryMail}</h1>
        </div>

        <div className="flex gap-2 my-2">
          <h1 className="font-semibold">Password:</h1>
          <h1>{productData?.data?.password}</h1>
        </div>
      </div>

      {/* request form  */}

      <div className="my-3  p-2 ">
        <form action="" onSubmit={handleSubmit(submitRequest)}>
          <h1 className="font-bold text-lg ">Request Form</h1>
          <h1>Enter Following details to request a refund</h1>
          {
            loadingProduct ? <div className="flex justify-center  pr-10 py-3 items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
                :

          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 my-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="">Ip address </label>
              <input
                type="text"
                placeholder="IP address used to login "
                className="w-full p-1 outline-none border focus:border-secondary"
                {...register('ipAddress', {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.ipAddress?.type === 'required' && 'Ip address is required'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Screenshot link</label>
              <textarea type="text"
                placeholder="Enter link to your failed login screenshot"
                className="w-full p-1 outline-none border focus:border-secondary"
               {...register('screenshotLink', {
                  required: true,
                  pattern: /^(https:\/\/[\w\d-]+(\.[\w\d-]+)+)+(,(https:\/\/[\w\d-]+(\.[\w\d-]+)+)+)*$/
                })}
               >

              </textarea>
             
              <p className="text-red-500 text-xs">
                {errors.screenshotLink?.type === 'required' && 'Screenshot link is required'}
                {errors.screenshotLink?.type === 'pattern' && 'Separate multiple links with a comma'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Description</label>
              <textarea
              className="w-full p-1 outline-none border focus:border-secondary" 
              placeholder='Add more details...'             
              {...register('description', {
                  required: true,
                })}></textarea>
              
            
              <p className="text-red-500 text-xs">
                {errors.description?.type === 'required' && 'Description is required'}
              </p>
            </div>
          </div>
          }

          <div className="flex justify-center my-4">
            {
              refundLoading ? <div className="flex justify-center  pr-10 py-3 items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
                :
            <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary ">
              Send
            </button>
            }
          </div>
        </form>
      </div>
    </div>
  )
}

export default RefundRequestPage
