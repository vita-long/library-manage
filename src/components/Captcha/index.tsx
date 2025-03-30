import React, { useState, useEffect } from 'react';
import { Input, Space, Spin, Button, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { DOMAIN_URL } from '@/commons/constants';
import httpRequest from '@/utils/http-request';

interface CaptchaInputProps {
  name: string;
  refreshKey?: number;
}

/**
 * 图形验证码
 * @param param0 
 * @returns 
 */
export const CaptchaInput = ({ name, refreshKey }: CaptchaInputProps) => {
  const [captchaSrc, setCaptchaSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCaptcha = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const svg = await httpRequest.get<any, { captcha: string }>(`${DOMAIN_URL}/user/captcha?t=${timestamp}`);
      setCaptchaSrc(`data:image/svg+xml;utf8,${encodeURIComponent(svg?.captcha)}`);
      setError('');
    } catch (err) {
      setError('验证码加载失败');
      setCaptchaSrc('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, [refreshKey]);

  return (
    <Space.Compact block>
      <Form.Item
        name={name}
        rules={[
          { required: true, message: '请输入验证码' }
        ]}
        validateStatus={error ? 'error' : undefined}
        help={error}
        style={{ flex: 1 }}
      >
        <Input
          placeholder="请输入验证码"
          autoComplete="off"
          maxLength={4}
          allowClear
        />
      </Form.Item>
      
      <div className="relative w-[120px] h-12 ml-2">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spin size="small" />
          </div>
        ) : (
          <Button
            type="text"
            onClick={fetchCaptcha}
            className="h-full p-0"
            disabled={loading}
          >
            {captchaSrc ? (
              <img
                src={captchaSrc}
                alt="验证码"
                className="w-full h-full cursor-pointer rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ReloadOutlined />
              </div>
            )}
          </Button>
        )}
      </div>
    </Space.Compact>
  );
};