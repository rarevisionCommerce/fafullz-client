import React from 'react'
import { useForm } from 'react-hook-form'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

function DeductBuyerBalance({ userId, handleCloseDeductForm, balance }) {
    const { register, handleSubmit, reset, formState } = useForm();
    const { errors } = formState
    const axios = useAxiosPrivate();
    const queryClient = useQueryClient()




    // deposit function
    const deduct = (payment) => {
        return axios.patch(`/payments/deduct`, payment)
    }

    const { mutate: deductMutate, isLoading: loadingdeduct, error } = useMutation(
        deduct,
        {
            onSuccess: (response) => {
                toast.success(response?.data?.message)
                queryClient.invalidateQueries([`payments-${userId}`])
                reset()
                handleCloseDeductForm();
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
    //   end deposit.........


    const submitDeduct = (data) => {
        data.buyerId = userId;
        deductMutate(data)
    }


  return (
    <div>
          {/* deposit form  */}
          <div className='pl-1 '>
              <form action="" onSubmit={handleSubmit(submitDeduct)}>
                  <div className="flex gap-2 mt-2">
                      <h1>Amount:</h1>
                      <input
                          type="number"
                          min={1}
                          max={balance}
                          step="any"
                          className="border w-full rounded-md px-1 outline-none py-1  focus:border-gray-700 focus:border-[1px] "
                          {...register('amount', {
                              required: true,
                          })}
                      />

                  </div>
                  <p className="text-red-500 text-xs py-1">
                      {errors.amount?.type === 'required' && 'Amount is required'}
                  </p>
                  <div className=' flex justify-center item-center'>
                      {loadingdeduct ? (
                          <div className="flex justify-center  items-center ">
                              <PulseLoader color="#6ba54a" size={10} />
                          </div>
                      ) : (
                          <button className="bg-primary  text-white rounded-md px-5 py-1 hover:bg-secondary">
                              Deduct
                          </button>
                      )}

                  </div>

              </form>
          </div>

    </div>
  )
}

export default DeductBuyerBalance