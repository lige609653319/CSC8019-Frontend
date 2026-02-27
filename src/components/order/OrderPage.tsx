import { Table, Tag, Typography, Card, Space, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface OrderDataType {
  key: string;
  orderId: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

const orders: OrderDataType[] = [
  { key: '1', orderId: '#ORD-001', customer: 'Alice Smith', amount: 125.50, status: 'Shipped', date: '2024-02-27' },
  { key: '2', orderId: '#ORD-002', customer: 'Bob Jones', amount: 89.99, status: 'Processing', date: '2024-02-27' },
  { key: '3', orderId: '#ORD-003', customer: 'Charlie Brown', amount: 210.00, status: 'Delivered', date: '2024-02-26' },
  { key: '4', orderId: '#ORD-004', customer: 'David Wilson', amount: 45.00, status: 'Cancelled', date: '2024-02-26' },
  { key: '5', orderId: '#ORD-005', customer: 'Eve Davis', amount: 320.75, status: 'Shipped', date: '2024-02-25' },
];

const OrderPage = () => {
  const columns: ColumnsType<OrderDataType> = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', render: (text) => <span style={{ fontWeight: 600 }}>{text}</span> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val) => `$${val.toFixed(2)}` },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = status === 'Shipped' ? 'blue' : (status === 'Delivered' ? 'green' : (status === 'Processing' ? 'gold' : 'volcano'));
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Space>
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
          <Title level={3} style={{ margin: 0 }}>Order Management</Title>
        </Space>
        <Button type="primary">Export Orders</Button>
      </div>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table columns={columns} dataSource={orders} />
      </Card>
    </div>
  );
};

export default OrderPage;
