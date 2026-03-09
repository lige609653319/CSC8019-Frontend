import { useState } from 'react';
import { Layout, ConfigProvider } from 'antd';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/dashboard/DashboardPage';
import UserPage from './components/user/UserPage';
import OrderPage from './components/order/OrderPage';
import StorePage from './components/store/StorePage';
import LoyaltyBalancePage from './components/layout/LoyaltyBalancePage.tsx';
import RedemptionHistoryPage from './components/layout/RedemptionHistoryPage.tsx';

const { Sider, Content } = Layout;

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

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
          <Header />
          <Content style={{ overflow: 'initial' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;