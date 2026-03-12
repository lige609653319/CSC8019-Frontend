import { useEffect, useState } from 'react';
import { Alert, Card, Empty, Spin, Table, Tag, Typography } from 'antd';
import { fetchLoyaltyTransactions, LoyaltyTxDto } from './loyaltyApi';

const { Title } = Typography;

const RedemptionHistoryPage: React.FC = () => {
  const [data, setData] = useState<LoyaltyTxDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await fetchLoyaltyTransactions(50);
        const redemptionOnly = result.filter((item) => item.type === 'REDEEM');
        setData(redemptionOnly);
      } catch (error: any) {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message;
        if (status === 401) setError('Unauthorized. Please log in.');
        else if (status === 403) setError('403 Forbidden');
        else if (msg) setError(msg);
        else if (error?.message === 'Network Error' || !error?.response) setError('Cannot reach server. Is the backend running on port 8080?');
        else setError('Failed to load redemption history.');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (value: string) => <Tag color="red">{value}</Tag>,
    },
    {
      title: 'Points Used',
      dataIndex: 'points',
      key: 'points',
      width: 160,
      render: (value: number) => Math.abs(value),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 220,
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

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
        Redemption History
      </Title>

      <Card style={styles.card}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: <Empty description="No redemption history found" />,
          }}
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
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
};

export default RedemptionHistoryPage;