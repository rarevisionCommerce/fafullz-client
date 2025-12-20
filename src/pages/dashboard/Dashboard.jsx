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
  ScrollArea,
  Indicator,
  ThemeIcon,
  UnstyledButton,
  Button,
  Stack,
  Divider,
  rem
} from "@mantine/core";
import {
  IconHome,
  IconNews,
  IconCurrencyBitcoin,
  IconCreditCard,
  IconShoppingCart,
  IconHeadset,
  IconRobot,
  IconSearch,
  IconBrandTelegram,
  IconMenu2,
  IconX,
  IconMessageCircle
} from "@tabler/icons-react";
import logo from "../../assets/graphics/fafullz-logo.jpg";
import ProfileDropDown from "../../components/ProfileDropDown";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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

function Dashboard() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const location = useLocation();
  
  const userName = auth?.userName || "username";

  // Cart Data
  const { data: cartData } = useQuery(
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
  const totalItems = cartData?.cart?.length || 0;

  // Payment History (Balance)
  const { data: paymentsData } = useQuery(
      ["payments"], 
      () => axiosPrivate.get(`/payments/payment-history/${auth?.userId}`), 
      {
        enabled: !!auth?.userId,
        refetchOnWindowFocus: true,
        keepPreviousData: true,
      }
  );

  // Unread Messages
  const { data: conversationData } = useQuery(
      [`message-count-${auth?.jabberId}`], 
      () => axiosPrivate.get(`/support/customer-unread/${auth?.jabberId}`), 
      {
        staleTime: 5000,
        refetchInterval: 5000,
      }
  );

  const navLinks = [
    { label: "News", path: "news", icon: <IconNews size="1rem" />, color: "orange" },
    { label: "Add Funds", path: "addfunds", icon: <IconCurrencyBitcoin size="1rem" />, color: "yellow" },
    { label: "SSN/DOB", path: "ssn", icon: <IconCreditCard size="1rem" />, color: "blue" },
    { label: "My Orders", path: "my-orders", icon: <IconShoppingCart size="1rem" />, color: "green" },
    { label: "Support", path: "support", icon: <IconHeadset size="1rem" />, color: "red" },
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
             <Navbar.Section>
                 <Divider my="sm" />
                 <Stack spacing="xs">
                     <Button 
                        variant="light" 
                        color="blue" 
                        leftIcon={<IconSearch size={16} />} 
                        fullWidth 
                        component="a" 
                        href="https://rarevision.net" 
                        target="_blank"
                     >
                        SSN Lookup
                     </Button>
                     <Button 
                        variant="light" 
                        color="indigo" 
                        leftIcon={<IconRobot size={16} />} 
                        fullWidth 
                        component="a" 
                        href="https://t.me/FafullzBot" 
                        target="_blank"
                     >
                        Telegram Bot
                     </Button>
                     <Button 
                        variant="light" 
                        color="cyan" 
                        leftIcon={<IconBrandTelegram size={16} />} 
                        fullWidth 
                        component="a" 
                        href="https://t.me/fafullzz" 
                        target="_blank"
                     >
                        Join Community
                     </Button>
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
                        gradient={{ from: 'blue', to: 'purple', deg: 45 }}
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                        className="hidden sm:block"
                    >
                        FAFullz
                    </Text>
                </Group>
            </Group>

            <Group spacing="lg">
                <Link to="/dash/support">
                    <Indicator 
                        label={conversationData?.data?.totalCustomerUnread} 
                        size={16} 
                        color="red" 
                        inline 
                        disabled={!conversationData?.data?.totalCustomerUnread}
                    >
                        <ActionIcon size="lg" variant="default" radius="md">
                            <IconMessageCircle size="1.2rem" />
                        </ActionIcon>
                    </Indicator>
                </Link>
                
                <Link to="cart">
                     <Indicator 
                        label={totalItems} 
                        size={16} 
                        color="blue" 
                        inline 
                        disabled={!totalItems}
                    >
                        <ActionIcon size="lg" variant="default" radius="md">
                            <IconShoppingCart size="1.2rem" />
                        </ActionIcon>
                    </Indicator>
                </Link>

                <ProfileDropDown userName={userName} balance={paymentsData?.data?.balance || 0} />
            </Group>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}

export default Dashboard;