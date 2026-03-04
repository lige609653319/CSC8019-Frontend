import { useState, useEffect } from 'react';
import { Card, Table, message, Typography, Space, Tag } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Define the shape of the data expected from the backend
interface MenuItem {
  id: number;
  name: string;
  category: string;
  regularPrice: number;
  largePrice: number;
  stock: number;
  isAvailable: boolean;
}

const MenuPage = () => {
  // State to store the fetched menu items and loading status
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/menu/list'); 
        
        if (response.ok) {
          const res = await response.json(); 
          // Extract the actual array from the backend's Result wrapper
          setMenuList(res.data || []); 
        } else {
          message.error('Failed to fetch menu data!');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        message.error('Network error. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []); // Empty dependency array means this runs only once

  // Define table columns
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { 
      title: 'Regular Price', 
      dataIndex: 'regularPrice', 
      key: 'regularPrice',
      render: (val: number) => `£${val?.toFixed(2) || '0.00'}` 
    },
    { 
      title: 'Large Price', 
      dataIndex: 'largePrice', 
      key: 'largePrice',
      render: (val: number) => val ? `£${val.toFixed(2)}` : '-' 
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { 
      title: 'Status', 
      dataIndex: 'isAvailable', 
      key: 'isAvailable',
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? 'green' : 'red'}>
          {isAvailable ? 'Available' : 'Sold Out'}
        </Tag>
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}><CoffeeOutlined /> Menu List</Title>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <Table 
            columns={columns} 
            dataSource={menuList} 
            loading={loading}
            rowKey="id" 
          />
        </Card>
      </Space>
    </div>
  );
};

export default MenuPage;