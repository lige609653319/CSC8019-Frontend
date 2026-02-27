import { Layout, Input, Badge, Avatar, Space } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = () => {
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
          <div style={styles.user}>
            <Avatar icon={<UserOutlined />} style={styles.avatar} />
            <span style={styles.userName}>Alex Johnson</span>
          </div>
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
