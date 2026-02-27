import { Card, Row, Col, Typography, Tag, Space, Button, Input } from 'antd';
import { ShopOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const products = [
  { id: 1, name: 'Premium Wireless Headset', price: 199.99, stock: 45, category: 'Electronics', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Minimalist Wall Clock', price: 49.50, stock: 120, category: 'Home Decor', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Mechanical Keyboard RGB', price: 129.00, stock: 15, category: 'Computing', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Ergonomic Office Chair', price: 289.00, stock: 8, category: 'Furniture', image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Smart Home Hub', price: 79.99, stock: 64, category: 'Electronics', image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Leather Travel Bag', price: 159.00, stock: 22, category: 'Accessories', image: 'https://via.placeholder.com/150' },
];

const StorePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Space>
          <ShopOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
          <Title level={3} style={{ margin: 0 }}>Store Management</Title>
        </Space>
        <Space>
          <Input prefix={<SearchOutlined />} placeholder="Search products..." style={{ width: 250 }} />
          <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} xl={6} key={product.id}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} style={{ height: 160, objectFit: 'cover' }} />}
              actions={[
                <Button type="link">Edit</Button>,
                <Button type="link" danger>Delete</Button>
              ]}
            >
              <Card.Meta
                title={product.name}
                description={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text type="secondary">{product.category}</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <Text strong style={{ fontSize: '18px' }}>${product.price.toFixed(2)}</Text>
                      <Tag color={product.stock < 10 ? 'red' : 'green'}>
                        Stock: {product.stock}
                      </Tag>
                    </div>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StorePage;
