// components/NavigationBar.tsx
import React from 'react';
import { Layout, Menu, Button, Avatar, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/components/AuthContext';
import Xian from '../../commons/assets/images/xianlingling.jpg';

const { Header } = Layout;

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  disabled?: boolean;
}

interface NavigationBarProps {
  logoPath?: string;         // Logo图片路径
  logoText?: string;         // Logo文字
  menuItems?: MenuItem[];    // 导航菜单项
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  logoPath = Xian,
  logoText = 'Logo',
  menuItems = []
}) => {
  const { isAuth, logout, login, user } = useAuth();
  console.log(user);
  // 处理菜单点击
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('Menu clicked:', e.key);
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px #f0f1f2',
        zIndex: 1,
        height: 64
      }}
    >
      {/* 左侧 Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={logoPath}
          alt="logo"
          style={{ height: 32, marginRight: 8 }}
        />
        <span style={{ fontSize: 18, fontWeight: 'bold' }}>{logoText}</span>
      </div>

      {/* 中间导航菜单 */}
      {menuItems.length > 0 && (
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['1']}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            flex: 1,
            justifyContent: 'center',
            borderBottom: 'none',
            background: 'transparent',
            minWidth: 400
          }}
        />
      )}

      {/* 右侧登录信息 */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuth ? (
          <>
            <Avatar 
              src={user?.avator} 
              icon={!user?.avator && <UserOutlined />}
              style={{ backgroundColor: '#87d068' }}
            />
            <span>{user?.userName || '用户'}</span>
            <Button onClick={() => logout()}>退出登录</Button>
          </>
        ) : (
          <Button 
            type="primary"
            onClick={() => console.log(1)}
          >
            登录
          </Button>
        )}
      </div>
    </Header>
  );
};

export default NavigationBar;