import React,{useState} from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PulseLoader from 'react-spinners/PulseLoader'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";


function AccountsCategories() {
    const axios = useAxiosPrivate();

   const [category, setCategory] = useState("");
     const queryClient = useQueryClient();
  // fetching category
  const fetchCategories = () => {
    return axios.get(`/categories/account`)
  }

  const { isLoading: loadingCategories, data: categoriesData, } = useQuery(
    [`accountsCategory`],
    fetchCategories,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  //end of fetching categories------------------
  // delete product
  const deleteMailCategory = () => {
    const productType = "account";
    return axios.delete(`/categories/${productType}/${category}`);
  };
  const { isLoading: isDeleting, mutate: deleteCategory } = useMutation(
    deleteMailCategory,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`filescategory-`]);

        refetch();
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const deleteProductById = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className=" shadow-xl p-[30px] flex flex-col gap-4">
            <h1 className="font-bold text-xl">Delete account category</h1>
            <p className="pb-1">Are you sure you want to delete this category?</p>
            <div className="flex gap-1">
              <button
                className="rounded-md  bg-gray-400 text-white w-[50%]font-bold px-5 py-1 hover:bg-tertiary "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md  bg-red-500 text-white font-bold px-5 w-[50%] py-1 hover:bg-tertiary "
                onClick={() => {
                  deleteCategory();
                  onClose();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
    });
  };
  // end of delete product


  return (
    <div>
      <h1 className='my-3'>Accounts categories added</h1>
      <div className="overflow-x-auto mb-3">
          <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  ProductCategory
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Action
                </th>
                
              </tr>
            </thead>

            <tbody className="text-dark">
              {loadingCategories ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !categoriesData?.data ||
                categoriesData?.data?.length < 1 ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3">
                    No categories found!
                  </td>
                </tr>
              ) : (
                categoriesData?.data?.categories?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        { item.category }
                      </td>
                     <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        <button
                          disabled={ isDeleting}
                          onClick={() => {
                            setCategory(item?.category);
                            deleteProductById();
                          }}
                          className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-gray-300"
                        >
                          Delete
                        </button>
                      </td>

                     
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
      </div>
    </div>
  )
}

export default AccountsCategories