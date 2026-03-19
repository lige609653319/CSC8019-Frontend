import { useState, useEffect } from 'react';
import { Layout, ConfigProvider } from 'antd';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/dashboard/DashboardPage';
import UserPage from './components/user/UserPage';
import OrderPage from './components/order/OrderPage';
import StorePage from './components/store/StorePage';
import LoginPage from './components/auth/LoginPage';
import LoyaltyBalancePage from './components/layout/LoyaltyBalancePage';
import RedemptionHistoryPage from './components/layout/RedemptionHistoryPage';
import TrainInfo from './components/train/TrainInfo';
import request from './utils/request';

const { Sider, Content } = Layout;

/** View keys for navigation */
const VIEW_KEYS = {
    DASHBOARD: 'dashboard',
    ORDER: 'order',
    USER: 'user',
    STORE: 'store',
    LOYALTY_BALANCE: 'loyalty-balance',
    LOYALTY_HISTORY: 'loyalty-history',
    ANALYTICS: 'analytics',
    SETTINGS: 'settings',
    TRAINS: 'trains',
} as const;

interface UserProfile {
    username: string;
    id?: string;
    email?: string;
    icon?: string;
}

function App() {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [currentView, setCurrentView] = useState<string>(VIEW_KEYS.DASHBOARD);
    const [user, setUser] = useState<UserProfile | null>(null);

    const fetchUserInfo = async () => {
        try {
            const res: any = await request.get('/api/auth/me');
            setUser(res?.data ?? res ?? null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('token');
        setToken(stored);
        if (stored) fetchUserInfo();
    }, []);

    const handleLoginSuccess = (newToken: string) => {
        setToken(newToken);
        setCurrentView(VIEW_KEYS.DASHBOARD); // 登录后跳到仪表板
        fetchUserInfo();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setCurrentView(VIEW_KEYS.DASHBOARD);
    };

    /** All content routes */
    const renderContent = () => {
        switch (currentView) {
            case VIEW_KEYS.DASHBOARD:
                return <DashboardPage />;
            case VIEW_KEYS.USER:
                return <UserPage />;
            case VIEW_KEYS.ORDER:
                return <OrderPage />;
            case VIEW_KEYS.STORE:
                return <StorePage />;
            case VIEW_KEYS.LOYALTY_BALANCE:
                return <LoyaltyBalancePage />;
            case VIEW_KEYS.LOYALTY_HISTORY:
                return <RedemptionHistoryPage />;
            case VIEW_KEYS.ANALYTICS:
                return <DashboardPage />;
            case VIEW_KEYS.SETTINGS:
                return <DashboardPage />;

            case VIEW_KEYS.TRAINS:
                return <TrainInfo />;
            default:
                return <DashboardPage />;
        }
    };

    if (!token) {
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
                    <Sidebar
                        currentView={currentView}
                        onViewChange={setCurrentView}
                        onLogout={handleLogout}
                    />
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