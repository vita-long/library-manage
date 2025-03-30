import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/components/AuthContext';
import Xian from '../../commons/assets/images/xianlingling.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
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
  const { isAuth, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>();
  const [openKeys, setOpenKeys] = useState<string[]>();
  useEffect(() => {
    const currentPath = location.pathname;
    // 设置选中项
    const matchedKey = menuItems
      .flatMap(item => [item, ...(item.children || [])])
      .find(item => currentPath === item.key)?.key;

    setSelectedKeys(matchedKey ? [matchedKey] : []);

    // 自动展开父级菜单
    const parentKeys = menuItems
      .filter(item => item.children?.some(child => currentPath.startsWith(child.key)))
      .map(item => item.key);
    setOpenKeys(parentKeys);
  }, [location]);

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
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({key}) => navigate(key)}
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
            onClick={() => window.location.href='/login'}
          >
            登录
          </Button>
        )}
      </div>
    </Header>
  );
};

export default NavigationBar;