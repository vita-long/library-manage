import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../NavigationBar';

const { Content } = Layout;

import {
  HomeOutlined,
  UserOutlined,
  ContactsOutlined,
} from '@ant-design/icons';

const menuItems = [
  { key: '/dashboard', icon: <HomeOutlined />, label: '首页' },
  { key: '/dashboard/books', icon: <UserOutlined />, label: '书籍' },
  // { key: '/dashboard/upload', icon: <ContactsOutlined />, label: '上传' },
  // { key: '/dashboard/live', icon: <ContactsOutlined />, label: '直播' },
];

export const PrivateLayout = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <NavigationBar
      logoText="仙灵灵"
      menuItems={menuItems}
    />
    <Content style={{ padding: '24px 48px' }}>
      <div style={{
        padding: 24,
        minHeight: 380,
        background: '#fff',
        borderRadius: 4,
        boxShadow: '0 2px 8px #f0f1f2',
      }}>
        <Outlet />
      </div>
    </Content>
  </Layout>
);