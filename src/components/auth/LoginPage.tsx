import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import request from '../../utils/request';

const { Title, Text } = Typography;
const { Content } = Layout;

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await request.post('/api/auth/login', values);

      const data = res.data || res;
      const token = data.token;
      const tokenHead = data.tokenHead;
      
      if (token && tokenHead) {
        // Concatenate tokenHead and token separated by space as requested
        const fullToken = `${tokenHead.trim()} ${token}`;
        localStorage.setItem('token', fullToken);
        message.success('Login successful');
        onLoginSuccess(fullToken);
      } else {
        message.error('Login failed: Invalid token');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // message.error(error.message || 'Login failed'); // request.ts already notifies on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1677ff 0%, #003a8c 100%)' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card 
          style={{ 
            width: 400, 
            borderRadius: 16, 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '40px 30px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              backgroundColor: '#e6f4ff', 
              borderRadius: '50%', 
              display: 'inline-flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 16
            }}>
              <LoginOutlined style={{ fontSize: 32, color: '#1677ff' }} />
            </div>
            <Title level={2} style={{ margin: 0 }}>Welcome Back</Title>
            <Text type="secondary">Please enter your credentials to login</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="Username" 
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block
                style={{ 
                  height: 48, 
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              © 2026 CSC8019 Staff Management System
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;
