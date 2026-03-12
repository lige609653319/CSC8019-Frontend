import { Layout, Input, Badge, Avatar, Space, Dropdown, MenuProps } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onLogout?: () => void;
  user?: {
    username: string;
    icon?: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ onLogout, user }) => {
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Personal Profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <AntHeader style={styles.header}>
      <Input
        placeholder="Search everything..."
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        style={styles.search}
      />
      <div style={styles.rightSection}>
        <Space size={24}>
          <Badge count={5} size="small">
            <BellOutlined style={styles.icon} />
          </Badge>
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div style={styles.user}>
              <Avatar 
                src={user?.icon} 
                icon={!user?.icon && <UserOutlined />} 
                style={styles.avatar} 
              />
              <span style={styles.userName}>{user?.username || 'Loading...'}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};


const styles: Record<string, React.CSSProperties> = {
  header: {
    padding: '0 24px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    lineHeight: '64px',
    borderBottom: '1px solid #f0f0f0',
  },
  search: {
    width: 300,
    borderRadius: '6px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '20px',
    cursor: 'pointer',
    color: 'rgba(0,0,0,0.45)',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  avatar: {
    backgroundColor: '#1677ff',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(0,0,0,0.88)',
  }
};

export default Header;
