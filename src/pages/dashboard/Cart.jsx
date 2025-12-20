import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { 
  Text, 
  Modal, 
  Button, 
  Group, 
  Container, 
  Paper, 
  Table, 
  Title, 
  ScrollArea, 
  ActionIcon, 
  Badge, 
  Stack, 
  Divider, 
  Center,
  Loader
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconShoppingCart, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { toast } from "react-toastify";

function Cart() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [productId, setDeleteId] = useState("");
  const queryClient = useQueryClient();
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [clearOpened, { open: openClear, close: closeClear }] = useDisclosure(false);
  const [checkoutOpened, { open: openCheckout, close: closeCheckout }] = useDisclosure(false);

  const productMap = {
    gVoice: "GoogleVoice",
    mail: "TextNow/Mail",
    file: "File",
    dump: "Dump",
    card: "Card",
    account: "Account",
    ssn: "SSN/DOB",
  };

  function useShoppingCart() {
    return useQuery(
      [`shoppingCart-${auth?.userId}`],
      async () => {
        const { data } = await axiosPrivate.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 5000,
      }
    );
  }

  const { isLoading: loadingCart, data: cartData } = useShoppingCart();
  const totalItems = cartData?.cart?.length || 0;

  let totalPrice =
    cartData?.cart?.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.price),
      0
    ) || 0;

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // remove product from cart
  const deleteProduct = () => {
    return axiosPrivate.delete(`/cart/${auth?.userId}/product/${productId}`);
  };
  const { isLoading: isDeleting, mutate: deleteProductMutate } = useMutation(
    deleteProduct,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );


  const handleDelete = () => {
    deleteProductMutate();
    closeDelete();
  };
  // end of delete product

  // clear cart
  const clearCart = () => {
    return axiosPrivate.delete(`/cart/products/${auth?.userId}`);
  };
  const { isLoading: clearCartLoading, mutate: clearCartMutate } = useMutation(
    clearCart,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const handleClear = () => {
    clearCartMutate();
    closeClear();
  };
  // end of clear cart

  // check Out cart
  const checkout = () => {
    return axiosPrivate.post(`/orders/${auth?.userId}`);
  };
  const { isLoading: checkoutLoading, mutate: checkoutMutate } = useMutation(
    checkout,
    {
      onSuccess: (response) => {
        const text = response?.data.message;
        toast.success(text);
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) => {
        const text = err?.response.data.message || "Something went wrong!!";
        toast.error(text);
      },
    }
  );
  const handleCheckout = () => {
    checkoutMutate();
    closeCheckout();
  };
  // end of checkout

  return (
    <Container size="lg" py="xl">
        <Paper shadow="sm" radius="md" withBorder p="md">
            <Group position="apart" mb="lg">
                <Title order={2}>Shopping Cart</Title>
                <Badge size="lg" variant="dot" color="blue">{totalItems} Items</Badge>
            </Group>

            <ScrollArea>
                <Table striped highlightOnHover verticalSpacing="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Category</th>
                            <th>Price</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {loadingCart ? (
                            <tr>
                                <td colSpan={4}>
                                    <Center py="xl">
                                        <Loader color="blue" />
                                    </Center>
                                </td>
                            </tr>
                        ) : !cartData?.cart || cartData?.cart?.length < 1 ? (
                            <tr>
                                <td colSpan={4}>
                                    <Stack align="center" spacing="xs" py="xl">
                                        <IconShoppingCart size={40} color="gray" opacity={0.5} />
                                        <Text color="dimmed" size="lg">Your cart is empty</Text>
                                    </Stack>
                                </td>
                            </tr>
                        ) : (
                            cartData?.cart?.map((cart, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Badge size="md" variant="outline">{productMap[cart?.category] || cart?.category}</Badge>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>${formatCurrency(cart?.price)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <ActionIcon 
                                            color="red" 
                                            variant="light" 
                                            onClick={() => {
                                                setDeleteId(cart?.productId);
                                                openDelete();
                                            }}
                                            loading={isDeleting && productId === cart?.productId}
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </ScrollArea>

            {cartData?.cart?.length > 0 && (
                <>
                <Divider my="lg" />
                <Group position="apart" align="flex-end">
                     <Button 
                        leftIcon={<IconTrash size={16} />} 
                        variant="subtle" 
                        color="red"
                        onClick={openClear}
                        loading={clearCartLoading}
                    >
                        Clear Cart
                    </Button>
                    
                    <Paper withBorder p="md" bg="dark.8" radius="md" w={300}>
                        <Stack spacing="sm">
                            <Group position="apart">
                                <Text color="dimmed">Total Items:</Text>
                                <Text weight={500}>{totalItems}</Text>
                            </Group>
                            <Group position="apart">
                                <Text size="lg" weight={700}>Total Price:</Text>
                                <Text size="lg" weight={700} color="green">${formatCurrency(totalPrice)}</Text>
                            </Group>
                            <Button 
                                fullWidth 
                                size="md" 
                                color="green" 
                                leftIcon={<IconCheck size={18} />}
                                onClick={openCheckout}
                                loading={checkoutLoading}
                                mt="sm"
                            >
                                Checkout
                            </Button>
                        </Stack>
                    </Paper>
                </Group>
                </>
            )}
        </Paper>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Remove Item" centered>
        <Text size="sm">Are you sure you want to remove this item from your cart?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDelete} loading={isDeleting}>Remove</Button>
        </Group>
      </Modal>

      <Modal opened={clearOpened} onClose={closeClear} title="Clear Cart" centered>
        <Stack align="center" spacing="sm">
            <IconAlertCircle size={40} color="orange" />
            <Text size="sm" align="center">Are you sure you want to remove <b>ALL</b> items ( {totalItems} ) from your cart? This action cannot be undone.</Text>
        </Stack>
        <Group position="center" mt="md" grow w="100%">
          <Button variant="default" onClick={closeClear}>Cancel</Button>
          <Button color="red" onClick={handleClear} loading={clearCartLoading}>Clear All</Button>
        </Group>
      </Modal>

      <Modal opened={checkoutOpened} onClose={closeCheckout} title="Confirm Checkout" centered>
         <Stack spacing="md">
            <Text size="sm">
                You are about to purchase <b>{totalItems}</b> items for a total of <Text span weight={700} color="green">${formatCurrency(totalPrice)}</Text>.
            </Text>
            <Text size="xs" color="dimmed">The amount will be deducted from your account balance immediately.</Text>
         </Stack>
        <Group position="right" mt="md">
          <Button variant="default" onClick={closeCheckout}>Cancel</Button>
          <Button color="blue" onClick={handleCheckout} loading={checkoutLoading}>Confirm Purchase</Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default Cart;
