import React, { useState } from 'react';
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
  rem,
  ScrollArea,
} from '@mantine/core';
 import {
  IconDashboard,
  IconCurrencyDollar,
  IconShoppingCart,
  IconHelp,
  IconMessages,
  IconLogout,
  IconUsers,
  IconBriefcase,
  IconReceipt2,
  IconQuestionMark,
} from '@tabler/icons-react';
import { MdSell, MdOutlineDashboard, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AiFillMoneyCollect } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import SellerProfileDropdown from '../components/SellerProfileDropdown';
import logo from "../assets/graphics/fafullz-logo.jpg";

function MainLink({ icon, color, label, path, active }) {
  return (
    <UnstyledButton
      component={Link}
      to={path}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: active ? theme.white : theme.colors.gray[0], 
        backgroundColor: active ? theme.colors.blue[8] : 'transparent',
        '&:hover': {
          backgroundColor: active ? theme.colors.blue[8] : theme.colors.gray[8],
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

export default function SellerDashboard() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();


  //get conversation......................
    function getUnreadMessagesCount() {
      return axiosPrivate.get(`/support/customer-unread/${auth?.jabberId}`);
    }
  
    const {
      data: conversationData,
    } = useQuery([`message-count-${auth?.jabberId}`], getUnreadMessagesCount, {
      staleTime: 5000, 
      refetchInterval: 5000, 
    });


  const data = [
    { icon: <MdOutlineDashboard size="1rem" />, color: 'blue', label: 'Dashboard', path: '/seller-dash/dashboard' },
    { icon: <MdSell size="1rem" />, color: 'teal', label: 'Sell Products', path: '/seller-dash/sell' },
    { icon: <MdOutlineProductionQuantityLimits size="1rem" />, color: 'violet', label: 'My Products', path: '/seller-dash/my-products' },
    { icon: <AiFillMoneyCollect size="1rem" />, color: 'grape', label: 'Withdraw Requests', path: '/seller-dash/withdrwal-request' },
    { icon: <FaQuestion size="1rem" />, color: 'orange', label: 'FAQ', path: '/seller-dash/FAQ' },
    { icon: <BiSupport size="1rem" />, color: 'red', label: 'Support', path: '/seller-dash/support' },
  ];

  const links = data.map((link) => (
    <MainLink
      {...link}
      key={link.label}
      active={location.pathname === link.path || location.pathname.startsWith(link.path + '/')}
    />
  ));

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.dark[8], 
          color: theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }} style={{ backgroundColor: '#111827', borderRight: '1px solid #374151' }}>
           <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
            <Stack spacing="xs">
                {links}
            </Stack>
          </Navbar.Section>
          <Navbar.Section>
             <Divider my="sm" color="gray.8" />
             <div className="flex items-center gap-3 px-2">
                 {/*  User Profile in Sidebar removed as it is in Header */}
             </div>

          </Navbar.Section>
        </Navbar>
      }

      header={
        <Header height={{ base: 60, md: 70 }} p="md" style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent:'space-between' }}>
            <div className='flex items-center h-full'>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[2]} 
                    mr="xl"
                />
                </MediaQuery>

                <Group spacing="xs">
                   <img src={logo} alt="FaFullz Logo" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                    <Text weight={700} size="lg" color="white" sx={{fontFamily: 'Greycliff CF, sans-serif'}}>FaFullz Seller</Text>
                </Group>
            </div>


            <Group spacing="lg">
                 <Link to="/seller-dash/support" style={{ textDecoration: 'none' }}>
                     <Indicator 
                        inline 
                        size={16} 
                        label={conversationData?.data?.totalCustomerUnread > 0 ? conversationData?.data?.totalCustomerUnread : null} 
                        color="red"
                        disabled={!conversationData?.data?.totalCustomerUnread}
                      >
                         <ActionIcon size="lg" variant="transparent" color="gray.2">
                            <IconMessages size="1.6rem" />
                         </ActionIcon>
                     </Indicator>
                 </Link>

                <SellerProfileDropdown />
            </Group>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
