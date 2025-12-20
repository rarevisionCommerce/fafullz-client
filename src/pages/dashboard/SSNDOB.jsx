import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { 
  Loader, 
  Pagination, 
  Select, 
  RangeSlider, 
  TextInput, 
  Button, 
  Group, 
  Container, 
  Paper, 
  Grid, 
  Text,
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  Collapse,
  Stack,
  ScrollArea,
  Divider,
  Title,
  Checkbox,
  Alert,
  Affix,
  Transition,
  rem
} from "@mantine/core";
import { IconShoppingCart, IconFilter, IconFilterOff, IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";
import filterOptions from "../filterOptions";
import countryList from "react-select-country-list";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

// Helper for Boolean status
const StatusBadge = ({ value }) => (
    value ? <IconCheck size={18} color="green" /> : <IconX size={18} color="red" />
);

// Memoized Row Component to prevent re-renders of all rows when one is selected
const SsnRow = React.memo(({ account, isSelected, toggleRow, inCart, onAddCart, showDescription }) => {
    return (
        <tr>
            <td>
                <Checkbox 
                    checked={isSelected} 
                    onChange={() => toggleRow(account._id)}
                    color="green"
                    disabled={inCart}
                    transitionDuration={0}
                    style={{ cursor: 'pointer' }}
                />
            </td>
            <td>{account?.price?.base}</td>
            <td>{account?.firstName || ""}</td>
            <td>{account?.dobYear}</td>
            <td>{account?.state}</td>
            <td>{account?.city}</td>
            <td>{account?.zip}</td>
            
            <td><StatusBadge value={account?.ssn} /></td>
            <td><StatusBadge value={account?.address} /></td>
            <td><StatusBadge value={account?.email} /></td>
            <td><StatusBadge value={account?.emailPass} /></td>
            <td><StatusBadge value={account?.faUname} /></td>
            <td><StatusBadge value={account?.faPass} /></td>
            <td><StatusBadge value={account?.backupCode} /></td>
            <td><StatusBadge value={account?.securityQa} /></td>
            
            {showDescription && (
                <td><Tooltip label={account?.description}><Text truncate w={100}>{account?.description}</Text></Tooltip></td>
            )}
            
            <td>
            <Badge variant="filled" color="green" size="md">${account?.price?.price}</Badge>
            </td>
            <td><StatusBadge value={account?.enrollment} /></td>
            
            <td>
                {inCart ? (
                    <Badge color="blue" variant="outline">In Cart</Badge>
                ) : (
                    <Tooltip label="Add to Cart">
                        <ActionIcon 
                        color="green" 
                        variant="filled" 
                        onClick={() => onAddCart(account?._id)}
                        >
                            <IconShoppingCart size={16} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </td>
        </tr>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.isSelected === nextProps.isSelected && 
        prevProps.inCart === nextProps.inCart && 
        prevProps.showDescription === nextProps.showDescription
    );
});

function SSNDOB() {
  const axios = useAxiosPrivate();

  const date = new Date();
  const currentYear = date.getFullYear();

  const countryOptions = useMemo(() => countryList().getData(), []);
  const { auth } = useAuth();

  const [showFilters, setShowFilters] = useState(true);

  const [perPage, setPerPage] = useState('300');
  const [base, setBase] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country1, setCountry1] = useState("");
  const [dob, setDob] = useState("");
  const [cs, setCs] = useState("");
  const [name, setName] = useState("");
  const [activePage, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [dobRange, setDobRange] = useState([1910, currentYear]);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const minValue = dobRange[0];
  const maxValue = dobRange[1];

  const fetchFiles = () => {
    return axios.get(
      `/ssn?page=${activePage}&perPage=${perPage}&base=${
        base || ""
      }&city=${city}&zip=${zip}&country=${country1}&dob=${minValue}&dobMax=${maxValue}&cs=${cs}&name=${name}&state=${state}`
    );
  };

  const {
    isLoading: loadingSsns,
    data: ssnData,
    refetch,
    isRefetching: refetchinSsn,
  } = useQuery(["ssns", activePage, perPage, base, state, city, zip, country1, name, minValue, maxValue], fetchFiles, {
    keepPreviousData: true,
    refetchOnWindowFocus: false // optimization
  });

  const totalPages = Math.ceil(ssnData?.data?.count / parseInt(perPage));

  // reset filters
  const resetFilters = () => {
    setBase("");
    setCity("");
    setCountry1("");
    setState("");
    setPerPage('300'); // Ensure string consistency for Select
    setZip("");
    setDob("");
    setCs("");
    setName("");
    setDobRange([1910, currentYear]);
  };
  
  //get all bases
  const getBases = () => {
    return axios.get(`/bases`);
  };

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ["bases-"],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );
  
  // making base optopns
  const baseOptions = basesData?.data?.bases?.map((base) => ({
      label: base.base,
      value: base.base,
      // store extra data if needed, but select value must be primitive usually
      showDescription: base.showDescription 
  })) || [];

  const selectedBaseObj = basesData?.data?.bases?.find(b => b.base === base);
  const showDescription = selectedBaseObj?.showDescription;


  // sending cart details
  const createCart = (cartData) => {
    return axios.post("/cart", cartData);
  };

  const {
    mutate: cartMutate,
    isLoading: loadingCart,
  } = useMutation(createCart, {
    onSuccess: (response) => {
      const text = response?.data.message;
      toast.success(text);
      queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      queryClient.invalidateQueries([`shoppingCartsnn-${auth?.userId}`]);
      setSelectedRows([]); // Clear selection on success
    },
    onError: (err) => {
      const text = err?.response.data.message;

      toast.error(text);
      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = useCallback((ProductId) => {
    const data = [{
      userId: auth?.userId,
      productId: ProductId,
      productType: "ssn",
    }];
    cartMutate(data);
  }, [auth?.userId, cartMutate]);
  
  const onBulkSubmit = () => {
      if (selectedRows.length === 0) return;
      const data = selectedRows.map(id => ({
          userId: auth?.userId,
          productId: id,
          productType: "ssn"
      }));
      cartMutate(data);
  };
  // end of sending  details

  // fetching user cart
  function useShoppingCart() {
    return useQuery(
      [`shoppingCartsnn-${auth?.userId}`],
      async () => {
        const { data } = await axios.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 3000,
      }
    );
  }
  const { isLoading: loadingUserCart, data: cartData } = useShoppingCart();

  // func to checkm if a product is in cart
  const cartProductIds = useMemo(() => {
       return new Set(cartData?.cart?.map(item => item.productId));
  }, [cartData]);

  // Row selection handlers
  const toggleRow = useCallback((id) => {
      setSelectedRows((prev) => 
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
  }, []);

  const toggleAll = () => {
      const availableIds = ssnData?.data?.ssns
        ?.filter(item => !cartProductIds.has(item._id))
        ?.map(item => item._id) || [];
        
      if (selectedRows.length >= availableIds.length && availableIds.length > 0) {
          setSelectedRows([]);
      } else {
          setSelectedRows(availableIds);
      }
  };

  const allSelected = ssnData?.data?.ssns?.length > 0 && 
    ssnData?.data?.ssns
    ?.filter(item => !cartProductIds.has(item._id))
    ?.every(item => selectedRows.includes(item._id));
    
  return (
    <Container size="xl" py="lg">
        <Paper shadow="sm" radius="md" withBorder>
             {/* Header */}
            <Group position="apart" p="md" bg="dark.6" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                 <Title order={4}>Fullz Directory</Title>
                 <Button 
                    variant="subtle" 
                    leftIcon={showFilters ? <IconFilterOff size={16} /> : <IconFilter size={16} />}
                    onClick={() => setShowFilters(!showFilters)}
                    size="sm"
                 >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                 </Button>
            </Group>
            
            <Collapse in={showFilters}>
               <Paper p="md" bg="dark.8" withBorder style={{ borderTop: 0 }}>
                    <Grid>
                        <Grid.Col span={12} sm={6} md={3}>
                             <Select label="Base" data={baseOptions} value={base} onChange={setBase} placeholder="Select Base" clearable />
                        </Grid.Col>
                        <Grid.Col span={12} sm={6} md={3}>
                             <Select label="State" data={filterOptions?.state} value={state} onChange={setState} placeholder="Select State" clearable searchable />
                        </Grid.Col>
                        <Grid.Col span={12} sm={6} md={3}>
                            <TextInput label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                        </Grid.Col>
                         <Grid.Col span={12} sm={6} md={3}>
                            <TextInput label="Zip" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip Code" />
                        </Grid.Col>

                        <Grid.Col span={12} sm={6} md={3}>
                             <Select label="Country" data={countryOptions} value={country1} onChange={setCountry1} placeholder="Select Country" clearable searchable />
                        </Grid.Col>
                        <Grid.Col span={12} sm={6} md={3}>
                             <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name Search" />
                        </Grid.Col>
                         <Grid.Col span={12} sm={12} md={6}>
                            <Text size="sm" weight={500} mb={5}>DOB Range: {dobRange[0]} - {dobRange[1]}</Text>
                             <RangeSlider 
                                min={1910} 
                                max={currentYear} 
                                step={1} 
                                value={dobRange} 
                                onChange={setDobRange}
                                label={(value) => value}
                                color="green"
                             />
                        </Grid.Col>
                         <Grid.Col span={12}>
                             <Group position="right">
                                 <Button variant="outline" color="red" onClick={resetFilters} size="sm">Reset Filters</Button>
                             </Group>
                        </Grid.Col>
                    </Grid>
               </Paper>
            </Collapse>
            
            {/* Bulk Select Helper & Controls */}
             <Group p="md" mt="xs" align="center" spacing="md">
                 <Alert icon={<IconInfoCircle size="1rem" />} color="blue" variant="outline" py="xs">
                    <strong>Bulk Action:</strong> Select multiple items using the checkboxes below. Your selection is preserved while you scroll.
                </Alert>
            </Group>

             <Group position="apart" px="md" pb="xs">
                 <Pagination total={totalPages || 1} page={activePage} onChange={setPage} color="green" size="sm" />
                 <Group spacing="xs">
                     <Text size="sm">Per Page:</Text>
                     <Select 
                        data={['300', '330', '350']} 
                        value={perPage} 
                        onChange={setPerPage} 
                        size="xs" 
                        w={80}
                     />
                 </Group>
            </Group>
            
            {/* Table */}
            <ScrollArea>
                <Table striped highlightOnHover fontSize="xs" verticalSpacing="xs">
                    <thead>
                        <tr>
                            <th>
                                <Checkbox 
                                    checked={allSelected && ssnData?.data?.ssns?.length > 0} 
                                    onChange={toggleAll}
                                    indeterminate={selectedRows.length > 0 && !allSelected}
                                    color="green"
                                    transitionDuration={0}
                                />
                            </th>
                            <th>Base</th>
                            <th>Name</th>
                            <th>DOB</th>
                            <th>State</th>
                            <th>City</th>
                            <th>Zip</th>
                            <th>SSN</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Email Pass</th>
                            <th>FA Uname</th>
                            <th>FA Pass</th>
                            <th>Backup</th>
                            <th>Sec Q&A</th>
                            {showDescription && <th>Description</th>}
                            <th>Price</th>
                            <th>Enrollment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {loadingSsns || refetchinSsn ? (
                             <tr>
                                 <td colSpan={19}>
                                     <Group position="center" py="xl">
                                         <Loader color="green" />
                                     </Group>
                                 </td>
                             </tr>
                         ) : ssnData?.data?.message ? (
                             <tr>
                                 <td colSpan={19}>
                                     <Text align="center" py="md">{ssnData?.data?.message}</Text>
                                 </td>
                             </tr>
                         ) : (
                             ssnData?.data?.ssns?.map((account) => (
                                 <SsnRow 
                                    key={account._id}
                                    account={account}
                                    isSelected={selectedRows.includes(account._id)}
                                    toggleRow={toggleRow}
                                    inCart={cartProductIds.has(account._id)}
                                    onAddCart={onSubmitting}
                                    showDescription={showDescription}
                                 />
                             ))
                         )}
                    </tbody>
                </Table>
            </ScrollArea>
             <Group position="center" p="md">
                 <Pagination total={totalPages || 1} page={activePage} onChange={setPage} color="green" />
            </Group>

        </Paper>

        {/* Floating Bulk Add Button */}
        <Affix position={{ bottom: rem(20), left: 0, right: 0 }} zIndex={199} style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
            <Transition transition="slide-up" mounted={selectedRows.length > 0}>
            {(transitionStyles) => (
                <Paper style={{ ...transitionStyles, pointerEvents: 'auto' }} shadow="md" p="sm" radius="md" withBorder bg="dark.7">
                    <Group>
                        <Text size="sm" weight={500} color="white">
                            {selectedRows.length} items selected
                        </Text>
                        <Button 
                            color="green" 
                            size="sm" 
                            leftIcon={<IconShoppingCart size={16} />}
                            onClick={onBulkSubmit}
                            loading={loadingCart}
                        >
                            Add to Cart
                        </Button>
                        <ActionIcon 
                            size="lg" 
                            color="gray" 
                            variant="subtle" 
                            onClick={() => setSelectedRows([])}
                        >
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                </Paper>
            )}
            </Transition>
        </Affix>
    </Container>
  );
}

export default SSNDOB;
