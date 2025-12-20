import { Menu, Group, Text, UnstyledButton, rem } from '@mantine/core';
import { IconLogout, IconKey, IconChevronDown, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';

export default function SellerProfileDropdown() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const navigate = useNavigate();
  const logOut = useLogout();
  const { auth } = useAuth();
  const userName = auth?.userName || "Seller";

  const signOut = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
      styles={{
        dropdown: { backgroundColor: '#1f2937', borderColor: '#374151' },
      }}
    >
      <Menu.Target>
        <UnstyledButton
          sx={(theme) => ({
            color: theme.colors.gray[0],
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.radius.sm,
            transition: 'background-color 100ms ease',
            backgroundColor: userMenuOpened ? theme.colors.dark[6] : 'transparent',

            '&:hover': {
              backgroundColor: theme.colors.dark[6],
            },
          })}
        >
          <Group spacing={7}>
             <IconUser size={20} stroke={1.5} />
            <Text weight={500} size="sm" sx={{ lineHeight: 1, color: "white" }} mr={3}>
              {userName}
            </Text>
            <IconChevronDown size={rem(12)} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
         <Menu.Label sx={{ color: '#9ca3af' }}>Seller Settings</Menu.Label>
        <Menu.Item
          icon={<IconKey size="0.9rem" stroke={1.5} />}
          onClick={() => navigate('/seller-dash/change-password')}
           sx={{ color: '#d1d5db', '&:hover': { backgroundColor: '#374151' } }}
        >
          Change Password
        </Menu.Item>
        <Menu.Divider sx={{ borderColor: '#374151' }} />
        <Menu.Item
          icon={<IconLogout size="0.9rem" stroke={1.5} />}
          onClick={signOut}
           sx={{ color: '#d1d5db', '&:hover': { backgroundColor: '#374151' } }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
