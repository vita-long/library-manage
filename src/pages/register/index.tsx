import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { http } from '@/utils/http';
import { CaptchaInput } from '@/components/Captcha';
import { useNavigate } from 'react-router-dom';
import { DOMAIN_URL } from '@/commons/constants';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
  captcha: string;
};

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致！');
      return;
    }
    
    setLoading(true);
    try {
      await http(`${DOMAIN_URL}/user/register`, {
        method: 'POST',
        data: {
          userName: values.username,
          email: values.email,
          password: values.password,
          captcha: values.captcha
        }
      });
      message.success('注册成功！');
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">创建新账户</h1>
          <p className="text-gray-500 mt-2">立即加入我们的社区</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          className="w-full"
          scrollToFirstError
        >
          {/* 用户名 */}
          <Form.Item<FieldType>
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 4, message: '用户名至少4个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-300" />}
              placeholder="用户名"
              className="h-12 rounded-lg"
            />
          </Form.Item>

          {/* 邮箱 */}
          <Form.Item<FieldType>
            name="email"
            rules={[
              { type: 'email', message: '邮箱格式不正确！' },
              { required: true, message: '请输入邮箱！' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-300" />}
              placeholder="邮箱"
              className="h-12 rounded-lg"
            />
          </Form.Item>

          {/* 密码 */}
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="密码"
              className="h-12 rounded-lg"
            />
          </Form.Item>

          {/* 确认密码 */}
          <Form.Item<FieldType>
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="确认密码"
              className="h-12 rounded-lg"
            />
          </Form.Item>

          <CaptchaInput name="captcha" refreshKey={4} />

          {/* 用户协议 */}
          <Form.Item<FieldType>
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('必须同意用户协议')),
              },
            ]}
          >
            <Checkbox className="text-gray-600">
              我已阅读并同意 <a className="text-blue-600">用户协议</a>
            </Checkbox>
          </Form.Item>

          {/* 注册按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-lg text-lg font-semibold"
            >
              立即注册
            </Button>
          </Form.Item>
        </Form>

        {/* 登录引导 */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            已有账号？{' '}
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              立即登录
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;