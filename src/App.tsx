import { useState, useEffect } from 'react';
import { Layout, ConfigProvider } from 'antd';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/dashboard/DashboardPage';
import UserPage from './components/user/UserPage';
import OrderPage from './components/order/OrderPage';
import StorePage from './components/store/StorePage';
import LoyaltyBalancePage from './components/layout/LoyaltyBalancePage.tsx';
import RedemptionHistoryPage from './components/layout/RedemptionHistoryPage.tsx';
import LoginPage from './components/auth/LoginPage';

import request from './utils/request';

const { Sider, Content } = Layout;

interface UserProfile {
  username: string;
  id?: string;
  email?: string;
  icon?: string;
}

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUserInfo = async () => {
    try {
      const res: any = await request.get('/api/auth/me');
      // request.ts returns the data directly if successful
      setUser(res.data || res);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // If fetching me fails, it might mean the token is invalid, 
      // but request.ts interceptor should handle 401.
    }
  };

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      fetchUserInfo();
    }

    // Optional: Add a listener for storage changes to handle multi-tab logout
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        const authed = !!e.newValue;
        setIsAuthenticated(authed);
        if (authed) fetchUserInfo();
        else setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (_token: string) => {
    setIsAuthenticated(true);
    fetchUserInfo();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'user':
        return <UserPage />;
      case 'order':
        return <OrderPage />;
      case 'store':
        return <StorePage />;
      case 'loyalty-balance':
        return <LoyaltyBalancePage />;
      case 'loyalty-history':
        return <RedemptionHistoryPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
          },
        }}
      >
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          width={260}
          theme="light"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            borderRight: '1px solid #f0f0f0',
            zIndex: 100,
          }}
        >
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        </Sider>
        <Layout style={{ marginLeft: 260 }}>
          <Header onLogout={handleLogout} user={user} />
          <Content style={{ overflow: 'initial' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;