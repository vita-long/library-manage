import React, {useState} from 'react';
import { Modal, Form, Input, message } from 'antd';
import { DOMAIN_URL } from '@/commons/constants';
import { http } from '@/utils/http';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateStreamModal = ({ visible, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { liveName: string }) => {
    try {
      setLoading(true);
      await http(`${DOMAIN_URL}/liveRoom`, {
        method: 'POST',
        data: {
          ...values
        }
      });
      message.success('直播间创建成功');
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      message.error('创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="创建新直播间"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label="直播间标题"
          name="liveName"
          rules={[
            { required: true, message: '请输入直播间标题' },
            { max: 50, message: '标题不能超过50个字符' }
          ]}
        >
          <Input placeholder="请输入直播间标题" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStreamModal;