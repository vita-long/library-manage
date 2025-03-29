import React, { useState, useEffect } from 'react';
import { Card, List, Button, Tag, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateStreamModal from '@/components/CreateStreamModal';
import { Stream } from '@/types/live';
import { DOMAIN_URL } from '@/commons/constants';
import { http } from '@/utils/http';

const { Title } = Typography;

const LiveList = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // 获取直播间列表
  const loadStreams = async () => {
    try {
      const data = await http<{ list: any[]}>(`${DOMAIN_URL}/liveRoom`,
        {
          method: 'GET'
        }
      );
      setStreams(data.list as any || []);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除直播间
  const handleDelete = async (id: string) => {
    try {
      await http(`${DOMAIN_URL}/liveRoom/${id}`, {
        method: 'DELETE'
      });
      message.success('删除成功');
      loadStreams();
    } catch (error) {
      message.error('删除失败');
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Space style={{ marginBottom: 24, width: '100%' }} align="center">
        <Title level={3} style={{ margin: 0 }}>直播间列表</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建直播间
        </Button>
      </Space>

      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={streams}
        renderItem={(stream) => (
          <List.Item>
            <Card
              title={stream.liveName}
              actions={[
                <Tag key="tag_1" color={stream.status === 'live' ? 'green' : 'red'}>
                  {stream.status === 'live' ? '直播中' : '未开播'}
                </Tag>,
                <Button 
                  key="but_1"
                  type="link" 
                  href={`/stream/${stream.liveId}`}
                >
                  进入直播间
                </Button>,
                <Button 
                  key="but_2"
                  type="link" 
                  danger
                  onClick={() => handleDelete(stream.liveId)}
                >
                  删除
                </Button>
              ]}
            >
              <div>
                <p>创建时间: {new Date(stream.createdAt).toLocaleString()}</p>
                <p>推流密钥: <code>{stream.streamKey}</code></p>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <CreateStreamModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={loadStreams}
      />
    </div>
  );
};

export default LiveList;