import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, 
    Group, 
    Text, 
    Avatar, 
    UnstyledButton, 
    Box, 
    rem,
    Badge
} from '@mantine/core';
import { 
    IconLogout, 
    IconUser, 
    IconWallet, 
    IconKey, 
    IconChevronDown 
} from '@tabler/icons-react';
import useLogout from '../hooks/useLogout';
// import drop down items

function ProfileDropDown({ userName, balance }) {
  const navigate = useNavigate();
  const logOut = useLogout();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const signOut = async () => {
    await logOut();
    navigate('/');
  };

  const formatCurrency = (number) => {
    return Number.parseFloat(number || 0)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            userMenuOpened ? 'bg-dark.6' : 'hover:bg-dark.6'
          }`}
        >
          <Group spacing="xs">
             <Badge 
                size="lg" 
                variant="gradient" 
                gradient={{ from: 'green', to: 'teal', deg: 105 }}
                styles={{ root: { textTransform: 'none', fontSize: rem(14) } }}
             >
                ${formatCurrency(balance)}
             </Badge>
            
            <Text weight={500} size="sm" sx={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }} color='white'>
              {userName}
            </Text>
             <IconChevronDown size={rem(16)} stroke={1.5} color='white' />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
            icon={<IconUser size="0.9rem" stroke={1.5} />}
            onClick={() => navigate('/dash/my-orders')}
        >
            My Orders
        </Menu.Item>
        <Menu.Item
            icon={<IconWallet size="0.9rem" stroke={1.5} />}
            onClick={() => navigate('/dash/addfunds')}
        >
            Add Balance
        </Menu.Item>
        <Menu.Item
            icon={<IconKey size="0.9rem" stroke={1.5} />}
            onClick={() => navigate('/dash/change-password')}
        >
            Change Password
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>System</Menu.Label>

        <Menu.Item
          icon={<IconLogout size="0.9rem" stroke={1.5} />}
          onClick={signOut}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ProfileDropDown;
