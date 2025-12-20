import React,{useState} from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PulseLoader from 'react-spinners/PulseLoader'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Text, Modal, Button, Group } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { toast } from "react-toastify";


function AccountsCategories() {
    const axios = useAxiosPrivate();

   const [category, setCategory] = useState("");
     const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
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
        queryClient.invalidateQueries([`accountsCategory`]); 

        // refetch(); // Same issue as above, refetch missing from destructuring in original code.
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const handleDelete = () => {
    deleteCategory();
    closeDelete();
  };
  // end of delete product


  return (
    <div>
      <h1 className='my-3 text-white'>Accounts categories added</h1>
      <div className="overflow-x-auto mb-3 rounded-lg border border-gray-700">
          <table className="w-full text-center table-auto border-collapse border border-gray-700 text-gray-300 text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="border border-gray-700 py-3 px-3">
                  Id
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  ProductCategory
                </th>
                <th className="border border-gray-700 py-3 px-3">
                  Action
                </th>
                
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {loadingCategories ? (
                 <tr>
                  <td colSpan={3} className="text-center py-6">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : !categoriesData?.data ||
                categoriesData?.data?.length < 1 ? (
                <tr>
                  <td colSpan={3} className="text-gray-400 text-center py-3">
                    No categories found!
                  </td>
                </tr>
              ) : (
                categoriesData?.data?.categories?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <td className="border border-gray-700 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border border-gray-700 py-2 px-3 font-medium text-white">
                        { item.category }
                      </td>
                     <td className="border border-gray-700 py-3 px-3">
                         <Button
                          compact
                          color="red"
                          loading={isDeleting}
                          onClick={() => {
                            setCategory(item?.category);
                            openDelete();
                          }}
                        >
                          Delete
                        </Button>
                      </td>

                     
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
      </div>
      
      <Modal 
        opened={deleteOpened} 
        onClose={closeDelete} 
        title="Delete account category" 
        centered
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <Text size="sm">Are you sure you want to delete this category?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDelete} loading={isDeleting}>Delete</Button>
        </Group>
      </Modal>

    </div>
  )
}

export default AccountsCategories