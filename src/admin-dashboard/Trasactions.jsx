import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { 
  Title, 
  Text, 
  Paper, 
  Group, 
  Table, 
  Pagination, 
  TextInput, 
  Badge, 
  Loader, 
  Grid,
  ScrollArea,
  Modal,
  Button
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function Transactions() {
  const axios = useAxiosPrivate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [opened, setOpened] = useState(false);

  // Fetch Total Balance
  const fetchTotalBalance = () => axios.get(`/payments/total-balance`);
  const { data: balanceData, isLoading: isLoadingBalance } = useQuery(
    ['totalBalance'], 
    fetchTotalBalance,
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  // Fetch Transactions
  const fetchTransactions = () => axios.get(`/payments/transactions`, { params: { page, search, limit: 10 } });
  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(
    ['transactions', page, search], 
    fetchTransactions, 
    { keepPreviousData: true }
  );

  // Parse balance data
  const totalBalArray = balanceData?.data?.totalBalance || [];
  const topTenUsers = balanceData?.data?.topTenUserBalances || [];
  
  // Calculate overall platform balance
  const overallBalance = totalBalArray.reduce((acc, curr) => acc + (curr.totalBalance || 0), 0);

  // Parse transactions data
  const transactions = transactionsData?.data?.transactions || [];
  const totalItems = transactionsData?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 10);

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="xl">Platform Transactions & Balances</Title>

      <Grid mb="xl">
        <Grid.Col xs={12} sm={4}>
          <Paper withBorder p="md" radius="md" shadow="sm">
            <Text size="sm" color="dimmed" tt="uppercase" weight={700}>Overall Supported Crypto & Deposits</Text>
            {isLoadingBalance ? <Loader size="sm" mt="sm" /> : (
              <Text size="xl" weight={800} mt="sm">${overallBalance.toFixed(2)}</Text>
            )}
          </Paper>
        </Grid.Col>
        
        <Grid.Col xs={12} sm={8}>
           <Paper withBorder p="md" radius="md" shadow="sm" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Group position="apart">
              <div>
                <Text size="sm" color="dimmed" tt="uppercase" weight={700}>Top 10 User Balances</Text>
                <Text size="xl" weight={800} mt="xs">
                  {isLoadingBalance ? <Loader size="xs" /> : `${topTenUsers.length} Users`}
                </Text>
              </div>
              <Button variant="light" onClick={() => setOpened(true)}>
                View Top Users
              </Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={<Title order={4}>Top 10 User Balances</Title>}
        size="lg"
      >
        <Table highlightOnHover verticalSpacing="sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {topTenUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td><Text weight={500}>{user?.userId?.userName || 'User'}</Text></td>
                <td><Text weight={600} color="green">${user?.balance?.toFixed(2) || 0}</Text></td>
              </tr>
            ))}
            {topTenUsers.length === 0 && (
              <tr>
                <td colSpan={3}><Text align="center" color="dimmed" py="md">No top balances found.</Text></td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <Group position="apart" mb="md">
          <Title order={3}>Transactions History</Title>
          <TextInput
            placeholder="Search by status, wallet..."
            icon={<IconSearch size="1rem" />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1); // reset to first page on search
            }}
            style={{ width: '300px' }}
          />
        </Group>

        <ScrollArea>
           {isLoadingTransactions ? (
             <Group position="center" p="xl"><Loader /></Group>
           ) : (
            <Table verticalSpacing="sm" highlightOnHover>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Coin</th>
                  <th>Amount</th>
                  <th>Wallet</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id || tx.id}>
                    <td><Text size="sm" weight={500}>{tx.id}</Text></td>
                    <td>{new Date(tx.date || tx.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge 
                        color={
                          tx.status?.toLowerCase() === 'confirmed' || tx.status?.toLowerCase() === 'success' ? 'green' 
                          : tx.status?.toLowerCase() === 'failed' ? 'red' 
                          : 'orange'
                        }
                        variant="filled"
                      >
                        {tx.status || 'Pending'}
                      </Badge>
                    </td>
                    <td><Badge color="gray">{tx.coin || '--'}</Badge></td>
                    <td><Text weight={600}>${tx.amount}</Text></td>
                    <td>
                      <Text size="sm" color="dimmed" style={{ maxWidth: '200px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {tx.wallet || '--'}
                      </Text>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                   <tr>
                     <td colSpan={6}><Text align="center" color="dimmed" py="md">No transactions match your search.</Text></td>
                   </tr>
                )}
              </tbody>
            </Table>
           )}
        </ScrollArea>

        {totalPages > 1 && (
          <Group position="right" mt="md">
            <Pagination total={totalPages} page={page} onChange={setPage} />
          </Group>
        )}
      </Paper>
    </div>
  );
}

export default Transactions;