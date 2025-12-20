import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  ActionIcon,
  Tooltip,
  Box,
  Indicator,
  ThemeIcon,
  UnstyledButton,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconDashboard,
  IconUsers,
  IconUser,
  IconCreditCard,
  IconCashBanknote,
  IconAdjustmentsDollar,
  IconReceiptRefund,
  IconHeadset,
  IconSearch
} from "@tabler/icons-react";
import logo from "../assets/graphics/fafullz-logo.jpg";
import AdminProfile from "../components/AdminProfile";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// Main Link Component
function MainLink({ icon, color, label, path, active, onClick }) {
    return (
      <UnstyledButton
        component={NavLink}
        to={path}
        onClick={onClick}
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          backgroundColor: active ? (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]) : 'transparent',
  
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>
  
          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    );
}

function AdminDashboard() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const location = useLocation();
  const userName = auth?.userName || "Admin";

  // Queries
  const fetchRefunds = () => axios.get(`/refunds/count`);
  const { data: refundData } = useQuery([`refundscount-`], fetchRefunds, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  const fetchSupportCount = () => axios.get(`/support/admin-unread`);
  const { data: supportData } = useQuery([`supportcount-`], fetchSupportCount, {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      staleTime: 5000,
      refetchInterval: 5000,
  });

  const fetchWithdrawRequestsCount = () => axios.get(`/withdrawals/unread`);
  const { data: withdrawData } = useQuery([`withdrawcount-`], fetchWithdrawRequestsCount, {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      staleTime: 5000,
      refetchInterval: 5000,
  });

  const navLinks = [
    { label: "Dashboard", path: "admindash", icon: <IconDashboard size="1rem" />, color: "blue" },
    { label: "Sellers", path: "sellers", icon: <IconUsers size="1rem" />, color: "cyan" },
    { label: "Buyers", path: "buyers", icon: <IconUser size="1rem" />, color: "teal" },
    { label: "SSN Products", path: "all-products", icon: <IconCreditCard size="1rem" />, color: "violet" },
    { label: "Withdraw Requests", path: "requests", icon: <IconCashBanknote size="1rem" />, color: "orange" },
    { label: "Set Prices", path: "set-prices", icon: <IconAdjustmentsDollar size="1rem" />, color: "grape" },
    { label: "Refunds", path: "refund", icon: <IconReceiptRefund size="1rem" />, color: "red" },
    { label: "Support", path: "supports", icon: <IconHeadset size="1rem" />, color: "pink" },
  ];

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 250, lg: 300 }}>
             <Navbar.Section grow mt="xs">
                <Stack spacing={5}>
                    {navLinks.map((link) => (
                        <MainLink
                            {...link}
                            key={link.label}
                            active={location.pathname.includes(link.path)}
                            onClick={() => setOpened(false)}
                        />
                    ))}
                </Stack>
             </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 60, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
            <Group>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                />
                </MediaQuery>

                <Group spacing="xs">
                    <img src={logo} alt="FAFullz Logo" style={{ width: 35, height: 35, borderRadius: 8 }} />
                    <Text 
                        size="xl" 
                        weight={800} 
                        variant="gradient" 
                        gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                        className="hidden sm:block"
                    >
                        FAFullz Admin
                    </Text>
                </Group>
            </Group>

            <Group spacing="lg">
                 <Link to="/admin-dash/requests">
                     <Tooltip label="Withdraw Requests">
                        <Indicator 
                            label={withdrawData?.data} 
                            size={16} 
                            color="orange" 
                            inline 
                            disabled={!withdrawData?.data}
                        >
                            <ActionIcon size="lg" variant="default" radius="md">
                                <IconCashBanknote size="1.2rem" />
                            </ActionIcon>
                        </Indicator>
                     </Tooltip>
                </Link>

                <Link to="/admin-dash/supports">
                    <Tooltip label="Support Tickets">
                        <Indicator 
                            label={supportData?.data?.totalAdminUnread} 
                            size={16} 
                            color="pink" 
                            inline 
                            disabled={!supportData?.data?.totalAdminUnread}
                        >
                            <ActionIcon size="lg" variant="default" radius="md">
                                <IconHeadset size="1.2rem" />
                            </ActionIcon>
                        </Indicator>
                    </Tooltip>
                </Link>

                <Link to="/admin-dash/refund">
                    <Tooltip label="Refund Requests">
                        <Indicator 
                            label={refundData?.data} 
                            size={16} 
                            color="red" 
                            inline 
                            disabled={!refundData?.data}
                        >
                            <ActionIcon size="lg" variant="default" radius="md">
                                <IconReceiptRefund size="1.2rem" />
                            </ActionIcon>
                        </Indicator>
                    </Tooltip>
                </Link>

                <AdminProfile userName={userName} />
            </Group>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}

export default AdminDashboard;
