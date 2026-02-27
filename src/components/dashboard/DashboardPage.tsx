import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  DollarCircleOutlined, 
  ProjectOutlined,
  ThunderboltOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StatCard = ({ title, value, prefix, suffix, trend, icon, color }: any) => (
  <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ backgroundColor: color + '15', color: color, padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div style={{ color: trend > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
          {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend)}%
        </div>
      </div>
      <Statistic
        title={<Text type="secondary">{title}</Text>}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ fontWeight: 700 }}
      />
    </Space>
  </Card>
);

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: 24560, prefix: '$', trend: 12.5, icon: <DollarCircleOutlined style={{ fontSize: '20px' }} />, color: '#1677ff' },
    { title: 'Total Users', value: 1240, trend: 8.2, icon: <UserOutlined style={{ fontSize: '20px' }} />, color: '#52c41a' },
    { title: 'New Projects', value: 45, trend: -3.4, icon: <ProjectOutlined style={{ fontSize: '20px' }} />, color: '#faad14' },
    { title: 'Active Sessions', value: 892, trend: 15.7, icon: <ThunderboltOutlined style={{ fontSize: '20px' }} />, color: '#722ed1' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Dashboard Overview</Title>
        <Text type="secondary">Welcome back, here's what's happening today.</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Activities" bordered={false} style={{ minHeight: '360px' }}>
            <div style={{ height: '200px', border: '1px dashed #d9d9d9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">Activity visualization will be rendered here.</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Performance" bordered={false} style={{ minHeight: '360px' }}>
            <div style={{ height: '200px', border: '1px dashed #d9d9d9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">Performance metrics will be shown here.</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
