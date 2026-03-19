import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { createStore, getStoreList, updateStore } from './api';
import StoreHoursModal from './StoreHoursModal';

const { Title } = Typography;

type StoreItem = {
  id: number;
  name: string;
  code: string;
  locationName?: string;
  status?: string;
};

const StorePage = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreItem | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [hoursOpen, setHoursOpen] = useState(false);
  const [hoursStoreName, setHoursStoreName] = useState<string>();

  const loadStores = async (params?: { name?: string }) => {
    try {
      setLoading(true);
      const res = await getStoreList(params);
      if (Array.isArray(res.data)) {
        setStores(res.data);
      }
    } catch (error) {
      console.error(error);
      message.error('Load store list failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleSearch = async () => {
    const values = searchForm.getFieldsValue();
    await loadStores(values);
  };

  const handleReset = async () => {
    searchForm.resetFields();
    await loadStores();
  };

  const handleOpenCreate = () => {
    setEditingStore(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: StoreItem) => {
    setEditingStore(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      locationName: record.locationName,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingStore) {
        await updateStore(editingStore.id, values);
        message.success('Store updated successfully');
      } else {
        await createStore(values);
        message.success('Store created successfully');
      }

      setIsModalOpen(false);
      setEditingStore(null);
      form.resetFields();
      await loadStores();
    } catch (error) {
      console.error(error);
      message.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatusLocal = (record: StoreItem) => {
    const nextStatus = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    setStores((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, status: nextStatus } : item
      )
    );

    message.success(
      nextStatus === 'ACTIVE'
        ? 'Activated locally'
        : 'Disabled locally'
    );
  };

  const columns: ColumnsType<StoreItem> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Code', dataIndex: 'code' },
    { title: 'Location', dataIndex: 'locationName' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v) => (
        <Tag color={v === 'ACTIVE' ? 'green' : 'red'}>
          {v || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleOpenEdit(record)}>Edit</Button>

          <Button onClick={() => handleToggleStatusLocal(record)}>
            {record.status === 'ACTIVE' ? 'Disable' : 'Activate'}
          </Button>

          <Button
            onClick={() => {
              setHoursStoreName(record.name);
              setHoursOpen(true);
            }}
          >
            Manage Hours
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Title level={3}>Store Management</Title>

          <Form form={searchForm} layout="inline">
            <Form.Item name="name">
              <Input placeholder="Search by name" />
            </Form.Item>
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Form>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={handleOpenCreate}>
              Add Store
            </Button>
          </div>

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={stores}
            pagination={false}
          />
        </Space>
      </Card>

      <Modal
        title={editingStore ? 'Edit Store' : 'Add Store'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStore(null);
          form.resetFields();
        }}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="locationName" label="Location">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <StoreHoursModal
        open={hoursOpen}
        storeName={hoursStoreName}
        onClose={() => setHoursOpen(false)}
      />
    </div>
  );
};

export default StorePage;