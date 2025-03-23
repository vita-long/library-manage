import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { http } from '@/utils/http';
import { useAuth, User } from '@/components/AuthContext';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);
    try {
      const res = await http<{data: { token: string, user: User }}>('http://localhost:4000/user/login', {
        method: 'POST',
        data: {
          username: values.username,
          password: values.password
        }
      });
      message.success('登录成功！');
      login(res?.data?.token, res.data?.user);
      setTimeout(() => {
        navigate('/home');
      }, 300);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">欢迎登录</h1>
          <p className="text-gray-500 mt-2">请输入您的账号和密码</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-300" />}
              placeholder="用户名"
              className="h-12 rounded-lg"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="密码"
              className="h-12 rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-between mb-6">
            <Form.Item<FieldType> name="remember" valuePropName="checked" className="mb-0">
              <Checkbox className="text-gray-600">记住我</Checkbox>
            </Form.Item>

            <a 
              href="#forgot-password" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              忘记密码？
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-lg text-lg font-semibold"
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            没有账号？{' '}
            <a 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              立即注册
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;