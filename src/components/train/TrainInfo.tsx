import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Typography, Input, Select, Button, Statistic, Row, Col, Alert, message } from 'antd';
import {
    ReloadOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './TrainInfo.module.css';
import { fetchUpcomingTrains, TrainData } from '../../utils/trainApi';

const { Title, Text } = Typography;
const { Option } = Select;

const TrainInfo: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [trains, setTrains] = useState<TrainData[]>([]);
    const [filteredTrains, setFilteredTrains] = useState<TrainData[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const [stats, setStats] = useState({
        total: 0,
        onTime: 0,
        delayed: 0,
        cancelled: 0,
        early: 0,
        arrived: 0
    });

    const fetchTrains = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching real train data...');
            const data = await fetchUpcomingTrains();
            console.log('Real data received:', data.length);

            setTrains(data);
            setFilteredTrains(data);
            setLastUpdated(new Date().toLocaleTimeString());

            const total = data.length;
            const arrived = data.filter(t => t.actualArrivalTime).length;
            const onTime = data.filter(t => t.status === 'ON_TIME' && !t.actualArrivalTime).length;
            const delayed = data.filter(t => t.status === 'DELAYED' && !t.actualArrivalTime).length;
            const cancelled = data.filter(t => t.status === 'CANCELLED').length;
            const early = data.filter(t => t.status === 'EARLY' && !t.actualArrivalTime).length;

            setStats({ total, onTime, delayed, cancelled, early, arrived });
        } catch (err) {
            console.error('Error fetching trains:', err);
            setError('Failed to fetch train data. Please check your connection.');
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrains();
        const interval = setInterval(fetchTrains, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let filtered = trains;

        if (searchText) {
            filtered = filtered.filter(train =>
                train.trainId.toLowerCase().includes(searchText.toLowerCase()) ||
                (train.currentStation?.toLowerCase() || '').includes(searchText.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            if (statusFilter === 'ARRIVED') {
                filtered = filtered.filter(train => train.actualArrivalTime);
            } else {
                filtered = filtered.filter(train => train.status === statusFilter && !train.actualArrivalTime);
            }
        }

        setFilteredTrains(filtered);
    }, [searchText, statusFilter, trains]);

    const getStatusTag = (status: string, delayMinutes: number | null, actualArrivalTime: string | null) => {
        if (actualArrivalTime) {
            return <Tag icon={<CheckCircleOutlined />} color="processing">Arrived</Tag>;
        }
        switch (status) {
            case 'ON_TIME':
                return <Tag icon={<CheckCircleOutlined />} color="success">On Time</Tag>;
            case 'DELAYED':
                return <Tag icon={<ClockCircleOutlined />} color="warning">Delayed {delayMinutes || ''}min</Tag>;
            case 'CANCELLED':
                return <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>;
            case 'EARLY':
                return <Tag icon={<CheckCircleOutlined />} color="processing">Early</Tag>;
            default:
                return <Tag color="default">Unknown</Tag>;
        }
    };

    const columns: ColumnsType<TrainData> = [
        {
            title: 'Train ID',
            dataIndex: 'trainId',
            key: 'trainId',
            render: (text) => <Text strong>{text}</Text>,
            sorter: (a, b) => a.trainId.localeCompare(b.trainId),
        },
        {
            title: 'Current Station',
            dataIndex: 'currentStation',
            key: 'currentStation',
            render: (text) => <Text>{text || 'Unknown'}</Text>,
        },
        {
            title: 'Arrival Time',
            key: 'arrivalTime',
            render: (_, record) => {
                const scheduled = record.scheduledArrivalTime
                    ? new Date(record.scheduledArrivalTime).toLocaleTimeString('en-GB', { hour12: false })
                    : '--';

                if (record.actualArrivalTime) {
                    return (
                        <Space direction="vertical" size="small">
                            <Text type="secondary" delete>{scheduled}</Text>
                            <Text type="success">
                                {new Date(record.actualArrivalTime).toLocaleTimeString('en-GB', { hour12: false })} (Arrived)
                            </Text>
                        </Space>
                    );
                }

                if (record.estimatedArrivalTime) {
                    return (
                        <Space direction="vertical" size="small">
                            <Text>{scheduled}</Text>
                            <Text type="warning">
                                Est: {new Date(record.estimatedArrivalTime).toLocaleTimeString('en-GB', { hour12: false })}
                            </Text>
                        </Space>
                    );
                }

                return scheduled;
            },
            sorter: (a, b) => {
                if (!a.scheduledArrivalTime) return 1;
                if (!b.scheduledArrivalTime) return -1;
                return new Date(a.scheduledArrivalTime).getTime() - new Date(b.scheduledArrivalTime).getTime();
            },
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => getStatusTag(record.status, record.delayMinutes, record.actualArrivalTime),
            filters: [
                { text: 'On Time', value: 'ON_TIME' },
                { text: 'Delayed', value: 'DELAYED' },
                { text: 'Cancelled', value: 'CANCELLED' },
                { text: 'Early', value: 'EARLY' },
                { text: 'Arrived', value: 'ARRIVED' },
            ],
            onFilter: (value, record) => {
                if (value === 'ARRIVED') return !!record.actualArrivalTime;
                return record.status === value && !record.actualArrivalTime;
            },
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
            render: (platform) => platform || 'TBC',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        message.info(`Order coffee for train ${record.trainId}`);
                    }}
                    disabled={!!record.actualArrivalTime}
                >
                    Order Coffee
                </Button>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={2}>🚂 Train Arrival Information</Title>
                    <Text type="secondary">
                        Last updated: {lastUpdated || '--'}
                        <Button
                            type="link"
                            icon={<ReloadOutlined />}
                            onClick={fetchTrains}
                            size="small"
                            style={{ marginLeft: 8 }}
                        >
                            Refresh
                        </Button>
                    </Text>
                </Col>
                <Col>
                    <Space>
                        <Input
                            placeholder="Search train or station"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            style={{ width: 250 }}
                        />
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 120 }}
                        >
                            <Option value="all">All</Option>
                            <Option value="ON_TIME">On Time</Option>
                            <Option value="DELAYED">Delayed</Option>
                            <Option value="CANCELLED">Cancelled</Option>
                            <Option value="EARLY">Early</Option>
                            <Option value="ARRIVED">Arrived</Option>
                        </Select>
                    </Space>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={8} md={6}>
                    <Card size="small">
                        <Statistic title="Total Trains" value={stats.total} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                    <Card size="small">
                        <Statistic title="On Time" value={stats.onTime} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                    <Card size="small">
                        <Statistic title="Delayed" value={stats.delayed} valueStyle={{ color: '#faad14' }} />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                    <Card size="small">
                        <Statistic title="Cancelled" value={stats.cancelled} valueStyle={{ color: '#f5222d' }} />
                    </Card>
                </Col>
            </Row>

            {error && (
                <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} closable onClose={() => setError(null)} />
            )}

            <Card title={`Upcoming Trains (Next 2 Hours)`} extra={<Text type="secondary">Total {filteredTrains.length}</Text>}>
                <Table
                    columns={columns}
                    dataSource={filteredTrains}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} trains` }}
                    scroll={{ x: 800 }}
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default TrainInfo;