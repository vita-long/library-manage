import * as React from 'react';
import { Button } from 'antd';
import { useAuth } from '@/components/AuthContext';

import './index.less';

const Home = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="home">hello Home~~
      <Button type="primary" onClick={handleLogout}>退出登录</Button>
    </div>
  );
};

export default Home;