import useAxiosPrivate from './useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from './useAuth';
import { toast } from 'react-toastify';


export const useCreateCart = () => {
  const axiosPrivate = useAxiosPrivate();
  const {auth} = useAuth();
  const queryClient = useQueryClient();
  const createCart = async (cartData) => {
    return axiosPrivate.post("/cart", cartData);
  }

  const {mutate:cartMutate, isLoading:loadingCart, error }=  useMutation(createCart, {
    onSuccess: (response) => {
      const text = response?.data.message
      toast.success(text);
      queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`])
      queryClient.invalidateQueries([`shoppingCartac-${auth?.userId}`])
      queryClient.invalidateQueries([`shoppingCartcard-${auth?.userId}`])
      queryClient.invalidateQueries([`shoppingCartGvoice-${auth?.userId}`])
      queryClient.invalidateQueries([`shoppingCartMail-${auth?.userId}`])
      queryClient.invalidateQueries([`shoppingCartfiles-${auth?.userId}`])
      queryClient.invalidateQueries([`shoppingCartDump-${auth?.userId}`])
    },
    onError: (err)=>{
      const text = err?.response.data.message
      toast.error(text)
      if(!err.response.data.message){
        toast.error("something went wrong")
      }
    }
  });

  return cartMutate;
};

