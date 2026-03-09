import { useEffect, useState } from 'react';
import { Alert, Card, Spin, Statistic, Typography } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { fetchLoyaltyBalance, LoyaltySummaryDto } from './loyaltyApi';

const { Title, Text } = Typography;

const LoyaltyBalancePage: React.FC = () => {
  const [data, setData] = useState<LoyaltySummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBalance = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await fetchLoyaltyBalance();
        setData(result);
      } catch (error: any) {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message;
        if (status === 401) setError('Unauthorized. Please log in.');
        else if (status === 403) setError('Access denied. Staff role required.');
        else if (msg) setError(msg);
        else if (error?.message === 'Network Error' || !error?.response) setError('Cannot reach server. Is the backend running on port 8080?');
        else setError('Failed to load loyalty balance.');
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Alert type="error" message={error} showIcon />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Title level={2} style={styles.title}>
        Loyalty Points Balance
      </Title>

      <Card style={styles.card}>
        <div style={styles.userSection}>
          <Text type="secondary">Username</Text>
          <div style={styles.username}>{data?.username}</div>
        </div>

        <Statistic
          title="Current Points Balance"
          value={data?.pointsBalance ?? 0}
          prefix={<GiftOutlined />}
          valueStyle={{ color: '#1677ff', fontWeight: 700 }}
        />
      </Card>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px',
  },
  title: {
    marginBottom: '24px',
  },
  card: {
    maxWidth: '600px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  userSection: {
    marginBottom: '24px',
  },
  username: {
    fontSize: '18px',
    fontWeight: 600,
    marginTop: '6px',
  },
};

export default LoyaltyBalancePage;