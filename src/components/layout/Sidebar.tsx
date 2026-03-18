import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  AppstoreOutlined
  GiftOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'menu', icon: <AppstoreOutlined />, label: 'Menu' },
    { key: 'order', icon: <ShoppingCartOutlined />, label: 'Order' },
    { key: 'user', icon: <UserOutlined />, label: 'User' },
    { key: 'store', icon: <ShopOutlined />, label: 'Store' },
    { key: 'loyalty-balance', icon: <GiftOutlined />, label: 'Loyalty Balance' },
    { key: 'loyalty-history', icon: <HistoryOutlined />, label: 'Redemption History' },
    { key: 'analytics', icon: <BarChartOutlined />, label: 'Analytics' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <div style={styles.sidebarInner}>
      <div style={styles.alogo}>
        <h2 style={styles.logoText}>AdminPanel</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[currentView]}
        onClick={({ key }) => onViewChange(key)}
        style={styles.menu}
        items={menuItems}
      />
      <div style={styles.logout}>
        <Menu
          mode="inline"
          selectable={false}
          style={styles.menu}
          onClick={({ key }) => key === 'logout' && onLogout?.()}
          items={[
            { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' }
          ]}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebarInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  logo: {
    padding: '24px',
    borderBottom: '1px solid #f0f0f0',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1677ff',
    margin: 0,
  },
  menu: {
    borderRight: 'none',
    flex: 1,
  },
  logout: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '8px',
    paddingBottom: '8px',
  }
};

export default Sidebar;