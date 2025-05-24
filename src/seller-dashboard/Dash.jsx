import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { toast } from 'react-toastify'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../hooks/useAuth'
import { Skeleton } from '@mantine/core'
import SalesChart from '../components/SalesChart'

function Dash() {
  const axios = useAxiosPrivate();
  // seller id from auth
  const { auth } = useAuth()
  const sellerId = auth?.jabberId;
  const userId = auth?.userId;
  const [withdrawForm, setWithdrawForm] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()

  //   fetching seller products  infor
  const fetchInfo = () => {
    return axios.get(`/sellers/${sellerId}`)
  }

  const {
    isLoading: loadingProduct,
    data: productsData,
    refetch,
    isRefetching: refetchingproducts,
  } = useQuery(['products'], fetchInfo, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  })
  // computing data
  const totalProducts =
    productsData?.data?.account?.totalProducts +
    productsData?.data?.card?.totalProducts +
    productsData?.data?.dump?.totalProducts +
    productsData?.data?.ssn?.totalProducts +
    productsData?.data?.gVoice?.totalProducts +
    productsData?.data?.mail?.totalProducts +
    productsData?.data?.file?.totalProducts

  const totalSold =
    productsData?.data?.account?.soldCount +
    productsData?.data?.card?.soldCount +
    productsData?.data?.dump?.soldCount +
    productsData?.data?.ssn?.soldCount +
    productsData?.data?.gVoice?.soldCount +
    productsData?.data?.mail?.soldCount +
    productsData?.data?.file?.soldCount

  const totalPrice =
    productsData?.data?.account?.totalPrice +
    productsData?.data?.card?.totalPrice +
    productsData?.data?.dump?.totalPrice +
    productsData?.data?.ssn?.totalPrice +
    productsData?.data?.gVoice?.totalPrice +
    productsData?.data?.mail?.totalPrice +
    productsData?.data?.file?.totalPrice

  const sellerEarning = 0.57 * totalPrice

  // chart data for total products
  const productsChartData = {
    title: 'Uploaded Products ',
    values: [
      productsData?.data?.account?.totalProducts,
      productsData?.data?.card?.totalProducts,
      productsData?.data?.ssn?.totalProducts,
      productsData?.data?.gVoice?.totalProducts,
      productsData?.data?.mail?.totalProducts,
      productsData?.data?.dump?.totalProducts,
      productsData?.data?.file?.totalProducts,
    ],
    labels: [
      'Accounts',
      'Cards',
      'Ssn/dob',
      'Gvoice',
      'TextNow',
      'Dumps',
      'Files',
    ],
    backgroundColor: '#184267',
  }

  // chart data for total products
  const salesChartData = {
    title: 'Sold Products ',
    values: [
      productsData?.data?.account?.soldCount,
      productsData?.data?.card?.soldCount,
      productsData?.data?.ssn?.soldCount,
      productsData?.data?.gVoice?.soldCount,
      productsData?.data?.mail?.soldCount,
      productsData?.data?.dump?.soldCount,
      productsData?.data?.file?.soldCount,
    ],
    labels: [
      'Accounts',
      'Cards',
      'Ssn/dob',
      'Gvoice',
      'TextNow',
      'Dumps',
      'Files',
    ],
    backgroundColor: '#008000',
  }
  // check if its sato
  const today = new Date()
  const dayOfWeek = today.getDay() + 1
  //end of fetching payments------------------

  // send withdral request..............................
  // upload function
  const sendRequest = (request) => {
    return axios.post("/withdrawals", request);
  };

  const {
    mutate: withdrwalMutate,
    isLoading: requestLoading,
    error,
  } = useMutation(sendRequest, {
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
  });

  const submitRequest = (data) => {
    data.userId = userId;
    data.userName = auth?.userName;
    data.sellerId = sellerId;
    data.amount = sellerEarning?.toFixed(2);
    withdrwalMutate(data);
  };
  // end withdrawal function............................
  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return (
    <div className="bg-light min-h-screen py-4 px-1 md:px-6 shadow-md">
      <div className="bg-gray-200 px-2">
        <h1 className="text-lg mb-[40px] mt-[10px] underline">
          Dashboard/analytics
        </h1>
        {loadingProduct ? (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-4 gap-4 md:content-center p-[50px] ">
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
            <Skeleton height={90} radius="sm" />
          </div>
        ) : (
          <div className="flex flex-col w-[90%] justify-center md:w-full md:grid md:grid-cols-4 gap-4 md:content-center p-[50px] ">
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 h ">
              <h1 className="text-lg font-semibold text-center">
                Products Uploaded
              </h1>
              <div className="text-center text-lg font-semibold my-4  ">
                {totalProducts || 0}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Total Sold Products
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                {totalSold || 0}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">
                Total Earnings
              </h1>
              <div className="text-center text-lg font-semibold my-3 ">
                ${formatCurrency(sellerEarning || 0)}
              </div>
            </div>
            <div className="min-h-[100px] bg-secondary bg-opacity-100  text-gray-200 px-1 py-2 shadow-md shadow-[#184267] hover:bg-opacity-90 ">
              <h1 className="text-lg font-semibold text-center">Withdraw</h1>
              <div className="text-center text-sm text-primary  font-semibold my-3 ">
                {dayOfWeek === 7 ? (
                  <h1
                    onClick={() => { setWithdrawForm(!withdrawForm) }}
                    className="underline cursor-pointer">send withdraw Request</h1>
                ) : (
                  <h1>Withdrawals are proccessed on saturday</h1>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* withdrawal form  */}
      <div id='Wform' className={withdrawForm ? "bg-gray-100 shadow-md my-5 py-4 px-3" : "hidden"} >
        <form action="" onSubmit={handleSubmit(submitRequest)}>
          <h1 className='text-center text-lg'>Send withdraw request</h1>

          <div className="flex my-3 justify-center items-center  w-full gap-3 min-h-[100px] ">
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Address (BTC wallet to receive payment)
                <span className="text-red-500 text-xs">
                  <sup>*</sup>
                </span>
              </label>

              <input
                type="text"
                placeholder='Enter BTC wallet address'
                className="w-full p-1 outline-none border focus:border-secondary"
                {...register('wallet', {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.address?.type === 'required' && 'Address is required'}
              </p>
            </div>

          </div>
          <div className='gap-4 flex justify-center'>
            {
              requestLoading ?
                <div className="flex justify-center mt-[100px] items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
                :
                <div className='flex gap-3'>

                  <button
                    disabled={sellerEarning < 1 ? true : false}
                    title={sellerEarning < 1 ? "No earnings" : ""}
                    className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary disabled:cursor-not-allowed disabled:bg-green-300 ">
                    Send
                  </button>
                  <p className="bg-secondary text-light py-1 px-4 rounded-md hover:bg-primary "
                    onClick={() => { setWithdrawForm(!withdrawForm) }}
                  >
                    Close
                  </p>
                </div>
            }


          </div>
        </form>
      </div>
      {loadingProduct ? (
        <div className="flex justify-center mt-[100px] items-center">
          <PulseLoader color="#6ba54a" size={10} />
        </div>
      ) : (
        ''
      )}
      <div className="flex flex-col md:grid md:grid-cols-2  gap-6 my-[100px] p-[50px]  ">
        <div className="w-[96%] ">
          <SalesChart data={productsChartData} />
        </div>
        <div className="  w-[96%] ">
          <SalesChart data={salesChartData} />
        </div>
      </div>
    </div>
  )
}

export default Dash
