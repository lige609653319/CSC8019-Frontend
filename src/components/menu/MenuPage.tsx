import { useState, useEffect } from 'react';
import { 
  Card, Table, message, Typography, Space, Tag, 
  Button, Popconfirm, Modal, Form, Input, 
  InputNumber, Select, Switch, Row, Col, Divider
} from 'antd';
import { 
  CoffeeOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined
} from '@ant-design/icons';
import request from '../../utils/request';

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
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Dynamic store list from backend
  const [storeList, setStoreList] = useState<any[]>([]);
  
  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // get store list
  const fetchStores = async () => {
    try {
      const res: any = await request.get('/api/store/list'); 
      if (res.code === 200 && Array.isArray(res.data)) {
        setStoreList(res.data);
       // Auto-select the first store if no store is currently selected 
        if (res.data.length > 0 && !searchForm.getFieldValue('storeId')) {
          searchForm.setFieldsValue({ storeId: res.data[0].id });
        }
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      message.error("Failed to load store list");
    }
  };

  // get menu data
  const fetchMenuData = async () => {
   // Prevent API calls if no store is selected
    const currentStoreId = searchForm.getFieldValue('storeId');
    if (!currentStoreId) return;

    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const res: any = await request.get('/api/menu/search', {
        params: {
          storeId: values.storeId,
          name: values.name,
          category: values.category
        }
      });
      setMenuList(res.data || []);
    } catch (error) {
      message.error('Load menu error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const init = async () => {
      // Fetch stores first, then fetch menu data
      await fetchStores();
      fetchMenuData();
    };
    init();
  }, []);

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/api/menu/${id}`);
      message.success('Delete success');
      fetchMenuData();
    } catch (error) { message.error('Delete error'); }
  };

  // Add or Update
  const handleFormSubmit = async (values: any) => {
    const isEditing = !!editingItem;
    const currentStoreId = searchForm.getFieldValue('storeId');

    try {
      if (isEditing && editingItem) {
        await request.patch(`/api/menu/${editingItem.id}`, { 
          name: values.name, 
          category: values.category 
        });

        for (const sku of values.skus) {
          if (sku.id) {
            await request.patch(`/api/menu/sku/${sku.id}`, sku);
          }
        }
        message.success('Update success');
      } else {
        const payload = { ...values, store: { id: currentStoreId } };
        await request.post(`/api/menu/create`, payload);
        message.success('Create success');
      }

      setIsModalOpen(false);
      fetchMenuData();
    } catch (error) { message.error('Save error'); }
  };

  const columns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
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

        <Card size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form form={searchForm} layout="inline" onFinish={fetchMenuData}>
              <Form.Item name="storeId" label={<span>Store</span>}>
                <Select 
                  style={{ width: 360 }} 
                  onChange={() => fetchMenuData()}
                  placeholder="Select a store"
                >
                  {storeList.map(s => (
                    <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item name="name" label="Name">
                <Input placeholder="Search name" allowClear autoComplete="off" />
              </Form.Item>
              
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
              if (!searchForm.getFieldValue('storeId')) {
                message.warning("Please select a store first");
                return;
              }
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

        <Card bordered={false} styles={{ body: { padding: 0 } }}>
          <Table columns={columns} dataSource={menuList} loading={loading} rowKey="id" />
        </Card>
      </Space>

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