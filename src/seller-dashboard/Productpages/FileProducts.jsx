import React, { useState, useEffect } from "react";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from "../../hooks/useAuth";
import { Select, Pagination, Table, Badge, Loader, Text, Paper, Title, Button, Group, Modal, ActionIcon, Grid } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from '@mantine/hooks';
import { toast } from "react-toastify";
import { IconTrash, IconDownload } from '@tabler/icons-react';

function FileProducts(props) {
    const axios = useAxiosPrivate();
  const [status, setStatus] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [perPage, setPerPage] = useState("30");
  const [activePage, setPage] = useState(1);
  const [productId, setDeleteId] = useState("");
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const { auth } = useAuth();

  const fetchProducts = () => {
    return axios.get(
      `/files/all/${auth?.jabberId}?page=${activePage}&perPage=${perPage}&status=${status}&isPaid=${isPaid}`
    );
  };

  const {
    isLoading: loadingProducts,
    data: productData,
    refetch,
    isRefetching: refetchingProducts,
  } = useQuery([`files-${auth?.jabberId}`, activePage, perPage, status, isPaid], fetchProducts, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });


  const totalPages = Math.ceil((productData?.data?.count || 0) / Number(perPage));

  // pagination refetch is handled by query key dependency

  // reset filters
  const resetFilters = () => {
    setIsPaid("");
    setStatus("");
    setPerPage("30");
    setPage(1);
  };

  const statusOptions = [
    { label: "Available", value: "Available" },
    { label: "Sold", value: "Sold" },
  ];
  const isPaidOptions = [
    { label: "Not Paid", value: "Not Paid" },
    { label: "Is Paid", value: "Is Paid" },
  ];
  const perPageOptions = [
    { label: "30", value: "30" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ];


  // delete product
  const deleteProduct = () => {
    const productType = "file";
    return axios.delete(`/sellers/delete/${productId}/${productType}`);
  };
  const { isLoading: isDeleting, mutate: deleteProductMutate } = useMutation(
    deleteProduct,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`files-${auth?.jabberId}`]);
        closeDelete();
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  
  const handleDelete = () => {
    deleteProductMutate();
  };
  
  const handleDownload = (fileName) => {
    window.location.href = `${fileName}`;
  };
  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
  return (
    <div className="min-h-screen">
      <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937', marginBottom: '20px' }}>
        <Grid>
             <Grid.Col span={6} sm={4} md={3}>
                <Select
                    label="Status"
                    placeholder="Filter by status"
                    data={statusOptions}
                    value={status}
                    onChange={(value) => {
                        setStatus(value);
                        setPage(1);
                    }}
                    styles={{
                        label: { color: "#d1d5db" },
                        input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                        item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                        dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                    }}
                    clearable
                />
             </Grid.Col>
             <Grid.Col span={6} sm={4} md={3}>
                <Select
                    label="Is Paid"
                    placeholder="Filter by payment"
                    data={isPaidOptions}
                     value={isPaid}
                    onChange={(value) => {
                        setIsPaid(value);
                        setPage(1);
                    }}
                    styles={{
                        label: { color: "#d1d5db" },
                        input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                        item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                        dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                    }}
                    clearable
                />
             </Grid.Col>
             <Grid.Col span={6} sm={4} md={3}>
                <Select
                    label="Per Page"
                    data={perPageOptions}
                    value={perPage}
                    onChange={(value) => {
                        setPerPage(value);
                        setPage(1);
                    }}
                    styles={{
                        label: { color: "#d1d5db" },
                        input: { backgroundColor: '#111827', color: 'white', borderColor: '#374151' },
                        item: { '&[data-selected]': { backgroundColor: '#2563eb' }, '&[data-hovered]': { backgroundColor: '#374151' } },
                        dropdown: { backgroundColor: '#1f2937', color: 'white', borderColor: '#374151' }
                    }}
                />
             </Grid.Col>
        </Grid>
        <div className="flex justify-between items-center mt-4 px-1">
             <Text color="white">Total: {productData?.data?.count || 0}</Text>
             <Button onClick={resetFilters} variant="filled" color="green">
                Reset filter
             </Button>
         </div>
      </Paper>
      
      <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#1f2937' }}>
         <div className="flex justify-center mb-4">
             <Pagination
              total={totalPages}
              value={activePage}
              onChange={setPage}
               color="green"
               styles={{
                  item: { backgroundColor: '#374151', color: '#d1d5db', '&[data-active]': { backgroundColor: '#2563eb' } }
              }}
            />
         </div>
         <div className="overflow-x-auto">
             <Table striped highlightOnHover withBorder withColumnBorders style={{ color: '#d1d5db' }}>
                <thead className="bg-gray-800 text-gray-200">
                  <tr>
                    <th>Id</th>
                    <th>Category</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>Description</th>
                    <th>Size</th>
                    <th>Download</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {loadingProducts || refetchingProducts ? (
                         <tr>
                          <td colSpan={9} align="center" style={{ padding: '20px' }}>
                            <Loader color="green" variant="dots" />
                          </td>
                        </tr>
                    ) : !productData?.data?.files || productData?.data?.files?.length < 1 ? (
                        <tr>
                          <td colSpan={9} align="center" style={{ color: '#9ca3af', padding: '20px' }}>
                            No File orders
                          </td>
                        </tr>
                    ) : (
                        productData?.data?.files?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.category}</td>
                                <td>{item?.country}</td>
                                <td>{item?.state}</td>
                                <td>{item?.description}</td>
                                <td>{item?.size}</td>
                                <td>
                                    <Button 
                                        variant="subtle" 
                                        compact 
                                        leftIcon={<IconDownload size={14}/>}
                                        disabled={item?.status === "Sold" || isDeleting}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDownload(item?.filePath);
                                        }}
                                    >
                                        Download
                                    </Button>
                                </td>
                                <td>${formatCurrency(item?.price)}</td>
                                <td>
                                     <ActionIcon 
                                        color="red" 
                                        variant="filled"
                                        disabled={item?.status === "Sold" || isDeleting}
                                        onClick={() => {
                                            setDeleteId(item?._id);
                                            openDelete();
                                        }}
                                    >
                                        <IconTrash size="1rem" />
                                    </ActionIcon>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </Table>
         </div>
      </Paper>

      <Modal 
        opened={deleteOpened} 
        onClose={closeDelete} 
        title={<Text color="white">Delete File</Text>} 
        centered
        styles={{ 
            content: { backgroundColor: '#1f2937', color: 'white' },
            header: { backgroundColor: '#1f2937', color: 'white' },
            close: { color: 'white', '&:hover': { backgroundColor: '#374151' } }
        }}
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <Text size="sm" color="gray.300">Are you sure you want to delete this item?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDelete} loading={isDeleting}>Delete</Button>
        </Group>
      </Modal>

    </div>
  );
}

export default FileProducts;
