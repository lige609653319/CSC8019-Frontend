import { Table, Tag, Button, Space, Typography, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface UserDataType {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const users: UserDataType[] = [
  { key: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { key: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { key: '3', name: 'Robert Brown', email: 'robert@example.com', role: 'Viewer', status: 'Inactive' },
  { key: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'Admin', status: 'Active' },
  { key: '5', name: 'Michael Wilson', email: 'michael@example.com', role: 'Editor', status: 'Pending' },
];

const UsersTable = () => {
  const columns: ColumnsType<UserDataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Active' ? 'green' : (status === 'Inactive' ? 'volcano' : 'gold');
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>User Management</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Add New User
        </Button>
      </div>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table columns={columns} dataSource={users} />
      </Card>
    </div>
  );
};

export default UsersTable;
