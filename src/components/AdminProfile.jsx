import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, 
    Group, 
    Text, 
    UnstyledButton, 
    rem,
    Badge
} from '@mantine/core';
import { 
    IconLogout, 
    IconUserPlus, 
    IconKey, 
    IconChevronDown,
    IconUserShield
} from '@tabler/icons-react';
import useLogout from '../hooks/useLogout';

function AdminProfile({ userName }) {
  const navigate = useNavigate();
  const logOut = useLogout();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

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
                gradient={{ from: 'indigo', to: 'cyan' }}
                leftSection={<IconUserShield size={14} style={{ marginTop: 5 }}/>}
                styles={{ root: { textTransform: 'none', fontSize: rem(14) } }}
             >
                Admin
             </Badge>
            
            <Text weight={500} size="sm" sx={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }} color='white'>
              {userName}
            </Text>
             <IconChevronDown size={rem(16)} stroke={1.5} color='white' />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Admin Actions</Menu.Label>
        <Menu.Item
            icon={<IconKey size="0.9rem" stroke={1.5} />}
            onClick={() => navigate('/admin-dash/change-pass')}
        >
            Change Password
        </Menu.Item>
        <Menu.Item
            icon={<IconUserPlus size="0.9rem" stroke={1.5} />}
            onClick={() => navigate('/admin-dash/add-seller')}
        >
            Add Seller
        </Menu.Item>
        <Menu.Item
            icon={<IconUserPlus size="0.9rem" stroke={1.5} />}
            onClick={() => navigate('/admin-dash/add-manager')}
        >
            Add Manager
        </Menu.Item>

        <Menu.Divider />

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

export default AdminProfile;
