import { useState, useEffect } from 'react';
import { 
  Card, Table, message, Typography, Space, Tag, 
  Button, Popconfirm, Modal, Form, Input, 
  InputNumber, Select, Switch, Row, Col, Divider
} from 'antd';
import { 
  CoffeeOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ShopOutlined
} from '@ant-design/icons';

const { Title } = Typography;

// Data structure for Menu and SKU
interface MenuItem {
  id: number;
  name: string;
  category: string;
  skus: MenuSku[];
  store: { id: number }; 
}

interface MenuSku {
  id?: number; 
  size: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

const MenuPage = () => {
  // State for data and loading
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Default store list if backend fails
  const [storeList, setStoreList] = useState<any[]>([
    { id: 1, name: "Whistlestop Coffee Hut Updated" },
    { id: 2, name: "Metro Coffee Express" },
    { id: 3, name: "City Beans" },
    { id: 4, name: "Harbour Brew Point" },
    { id: 5, name: "Map Valid Cafe" },
    { id: 6, name: "Contact Test Cafe Updated" }
  ]);
  
  const [searchForm] = Form.useForm(); // Form for search bar
  const [form] = Form.useForm();       // Form for Add/Edit modal
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Get all stores from backend
  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/store/list'); 
      const res = await response.json();
      if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setStoreList(res.data);
      }
    } catch (error) {
      console.log("Use default store list");
    }
  };

  // Get menu data with search filters
  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const queryParams: any = {
        storeId: values.storeId || 1,
        name: values.name,
        category: values.category
      };
      
      // Remove empty parameters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const query = new URLSearchParams(queryParams).toString();
      const response = await fetch(`http://localhost:8080/api/menu/search?${query}`); 
      if (response.ok) {
        const res = await response.json(); 
        setMenuList(res.data || []);
      }
    } catch (error) {
      message.error('Load menu error');
    } finally {
      setLoading(false);
    }
  };

  // Run when page starts
  useEffect(() => { 
    searchForm.setFieldsValue({ storeId: 1 });
    const init = async () => {
      await fetchStores();
      fetchMenuData();
    };
    init();
  }, []);

  // Delete one item
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/menu/${id}`, { method: 'DELETE' });
      if (response.ok) {
        message.success('Delete success');
        fetchMenuData();
      }
    } catch (error) { message.error('Delete error'); }
  };

  // Save data (Add or Update)
  const handleFormSubmit = async (values: any) => {
    const isEditing = !!editingItem;
    const currentStoreId = searchForm.getFieldValue('storeId');

    try {
      if (isEditing && editingItem) {
        // Update Menu name and category
        await fetch(`http://localhost:8080/api/menu/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: values.name, category: values.category }),
        });

        // Update each SKU price and stock
        for (const sku of values.skus) {
          if (sku.id) {
            await fetch(`http://localhost:8080/api/menu/sku/${sku.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(sku),
            });
          }
        }
        message.success('Update success');
      } else {
        // Create new menu
        const payload = { ...values, store: { id: currentStoreId } };
        await fetch(`http://localhost:8080/api/menu/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('Create success');
      }

      setIsModalOpen(false);
      fetchMenuData();
    } catch (error) { message.error('Save error'); }
  };

  // Table columns definition
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Category', 
      dataIndex: 'category', 
      render: (cat: string) => <Tag color={cat === 'COFFEE' ? 'orange' : 'blue'}>{cat}</Tag>
    },
    { 
      title: 'Regular Price', 
      render: (_: any, record: MenuItem) => {
        const sku = record.skus?.find(s => s.size === 'REGULAR');
        return sku ? `£${sku.price.toFixed(2)}` : '-';
      }
    },
    { 
      title: 'Large Price', 
      render: (_: any, record: MenuItem) => {
        const sku = record.skus?.find(s => s.size === 'LARGE');
        return sku ? `£${sku.price.toFixed(2)}` : '-';
      }
    },
    { 
      title: 'Total Stock', 
      render: (_: any, record: MenuItem) => record.skus?.reduce((sum, s) => sum + s.stock, 0) || 0
    },
    { 
      title: 'Status', 
      render: (_: any, record: MenuItem) => {
        const avail = record.skus?.some(s => s.isAvailable && s.stock > 0);
        return <Tag color={avail ? 'green' : 'red'}>{avail ? 'Available' : 'Sold Out'}</Tag>;
      }
    },
    {
      title: 'Action',
      render: (_: any, record: MenuItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingItem(record);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }}>Edit</Button>
          <Popconfirm title="Delete this?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}><CoffeeOutlined /> Menu Management</Title>

        {/* Search section */}
        <Card size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form form={searchForm} layout="inline" onFinish={fetchMenuData}>
              {/* Store select */}
              <Form.Item name="storeId" label={<span><ShopOutlined /> Store</span>}>
                <Select style={{ width: 280 }} onChange={() => fetchMenuData()}>
                  {storeList.map(s => (
                    <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              {/* Name search */}
              <Form.Item name="name" label="Name">
                <Input placeholder="Search name" allowClear autoComplete="off" />
              </Form.Item>
              
              {/* Category select */}
              <Form.Item name="category" label="Category">
                <Select placeholder="All" allowClear style={{ width: 120 }}>
                  <Select.Option value="COFFEE">COFFEE</Select.Option>
                  <Select.Option value="CHOCOLATE">CHOCOLATE</Select.Option>
                  <Select.Option value="WATER">WATER</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">Search</Button>
              </Form.Item>
            </Form>

            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingItem(null);
              form.resetFields();
              form.setFieldsValue({ 
                skus: [
                  {size:'REGULAR',price:0,stock:0,isAvailable:true},
                  {size:'LARGE',price:0,stock:0,isAvailable:true}
                ] 
              });
              setIsModalOpen(true);
            }}>Add Product</Button>
          </div>
        </Card>

        {/* Data table */}
        <Card bordered={false} styles={{ body: { padding: 0 } }}>
          <Table columns={columns} dataSource={menuList} loading={loading} rowKey="id" />
        </Card>
      </Space>

      {/* Add and Edit Modal */}
      <Modal
        title={editingItem ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={650}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Name" rules={[{required:true}]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{required:true}]}>
                <Select>
                  <Select.Option value="COFFEE">COFFEE</Select.Option>
                  <Select.Option value="CHOCOLATE">CHOCOLATE</Select.Option>
                  <Select.Option value="WATER">WATER</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider plain>Price and Stock</Divider>
          
          <Form.List name="skus">
            {(fields) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card size="small" key={key} style={{ marginBottom: 12 }} title={form.getFieldValue(['skus', name, 'size'])}>
                    {/* Hidden ID for update */}
                    <Form.Item {...restField} name={[name, 'id']} hidden><Input /></Form.Item>
                    <Form.Item {...restField} name={[name, 'size']} hidden><Input /></Form.Item>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item {...restField} name={[name, 'price']} label="Price">
                          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...restField} name={[name, 'stock']} label="Stock">
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...restField} name={[name, 'isAvailable']} valuePropName="checked" label="Available">
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuPage;