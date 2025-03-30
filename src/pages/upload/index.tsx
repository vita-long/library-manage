import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Upload, Progress, message } from 'antd';
// import type { UploadProps } from 'antd';
import { useAuth } from '@/components/AuthContext';
import io, { Socket } from 'socket.io-client';

import './index.less';
import { DOMAIN_URL } from '@/commons/constants';
import httpRequest from '@/utils/http-request';
// import { DOMAIN_URL, LOGIN_TOKEN_STORAGE_KEY } from '@/commons/constants';
// import { storage } from '@/utils/storage';

const Home = () => {
  const { logout } = useAuth();

  const [progress, setProgress] = useState(0);
  const [socket, setSocket] = useState<Socket | undefined>();
  const [currentUpload, setCurrentUpload] = useState<{file: any, xhr: any} | undefined>();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    
    // 初始化 Socket 连接
    const newSocket: Socket = io('http://localhost:4000', {
      transports: ['websocket'], // 强制使用 WebSocket
      autoConnect: true,
      withCredentials: true
    });
    newSocket.on('connect', () => {
      console.log('[Socket] Connected, ID:', newSocket.id); // 确保输出有效ID
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection Error:', err);
    });

    setSocket(newSocket);
    
    // 监听进度事件
    newSocket.on('upload-progress', (percent) => {
      if (percent < 100) {
        setProgress(percent);
      } else {
        setProgress(100);
      }
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
  const beforeUpload = (file: any) => {
    // 保存上传上下文
    setCurrentUpload({
      file: file as any,
      xhr: null
    });

    return false; // 阻止自动上传
  };

  const handleUpload = async () => {
    if (!currentUpload) return;

    const { file } = currentUpload;
    
    const encodedFileName = encodeURIComponent(file.name);
    const blob = new Blob([file], { type: file.type });
    const correctedFile = new File([blob], encodedFileName, {
      type: file.type,
      lastModified: file.lastModified
    });
    const formData = new FormData();
    formData.append('file', correctedFile);
    const res = await httpRequest.upload<{file: any}>(`${DOMAIN_URL}/upload/single`, formData as any, undefined, {
      headers: {
        'X-Socket-ID': socket && socket.id
      }
    });
    if (res?.file) {
      setImage(res?.file?.path);
      message.success('上传成功');
      if(socket) {
        socket?.disconnect();
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleOCR = async () => {
    try {
      const data = await httpRequest.post(`${DOMAIN_URL}/api/ocr`, { file: image });
      console.log(data);
    } catch(e) {
      console.log(e);
    }
  };
  
  return (
    <div className="home">hello Home~~
      <Button type="primary" onClick={handleLogout}>退出登录</Button>
      <Upload
        // {...props}
        beforeUpload={beforeUpload}
        showUploadList={false}
        maxCount={1}
      >
        <Button>上传</Button>
      </Upload>
      <Button onClick={handleOCR}>OCR识别</Button>

      {currentUpload && (
        <div style={{ marginTop: 16, width: '300px' }}>
          <div>{currentUpload.file.name}</div>
          <Progress
            percent={progress}
            status={progress === 100 ? 'success' : 'active'}
          />
          <Button
            type="primary"
            onClick={handleUpload}
            style={{ marginTop: 8 }}
          >
            开始上传
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;