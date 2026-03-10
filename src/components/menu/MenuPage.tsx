import { useState, useEffect } from 'react';
import { 
  Card, Table, message, Typography, Space, Tag, 
  Button, Popconfirm, Modal, Form, Input, 
  InputNumber, Select, Switch 
} from 'antd';
import { 
  CoffeeOutlined, DeleteOutlined, EditOutlined, PlusOutlined 
} from '@ant-design/icons';

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
  // --- States ---
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  // --- API Calls ---

  // 1. Fetch List
  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/menu/list'); 
      if (response.ok) {
        const res = await response.json(); 
        setMenuList(res.data || []); 
      } else {
        message.error('Failed to fetch menu data!');
      }
    } catch (error) {
      message.error('Network error. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // 2. Delete Item
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/menu/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Item deleted successfully');
        setMenuList(prev => prev.filter(item => item.id !== id));
      } else {
        message.error('Failed to delete item');
      }
    } catch (error) {
      message.error('Network error during deletion');
    }
  };

  // 3. Create or Update Item
  const handleFormSubmit = async (values: any) => {
    const isEditing = !!editingItem;
    const url = isEditing 
      ? `http://localhost:8080/api/menu/${editingItem.id}` 
      : 'http://localhost:8080/api/menu/create';
    
    // Use PATCH for updates (Partial), POST for creation
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`${isEditing ? 'Updated' : 'Created'} successfully!`);
        setIsModalOpen(false);
        fetchMenuData(); // Refresh the list
      } else {
        message.error('Operation failed');
      }
    } catch (error) {
      message.error('Network error during submission');
    }
  };

  // --- Modal Helpers ---

  const openAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: MenuItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // --- Table Configuration ---
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Category', 
      dataIndex: 'category', 
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag> 
    },
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
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: MenuItem) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}><CoffeeOutlined /> Menu Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add
          </Button>
        </div>

        {/* Table Section */}
        <Card bordered={false} styles={{ body: { padding: 0 } }}>
          <Table 
            columns={columns} 
            dataSource={menuList} 
            loading={loading}
            rowKey="id" 
          />
        </Card>
      </Space>

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ isAvailable: true, stock: 0 }}
        >
          <Form.Item name="name" label="Item Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="e.g. Latte" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select a category">
              <Select.Option value="COFFEE">COFFEE</Select.Option>
              <Select.Option value="CHOCOLATE">CHOCOLATE</Select.Option>
              <Select.Option value="WATER">WATER</Select.Option>
            </Select>
          </Form.Item>

          <Space size="large">
            <Form.Item name="regularPrice" label="Regular Price (£)" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.1} precision={2} />
            </Form.Item>
            <Form.Item name="largePrice" label="Large Price (£)">
              <InputNumber min={0} step={0.1} precision={2} />
            </Form.Item>
          </Space>

          <Form.Item name="stock" label="Stock Quantity">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="isAvailable" label="Is Available" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuPage;