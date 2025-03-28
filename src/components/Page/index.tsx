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
  { key: '1', icon: <HomeOutlined />, label: '首页' },
  { key: '2', icon: <UserOutlined />, label: '关于我们' },
  { key: '3', icon: <ContactsOutlined />, label: '联系我们' },
];

export const PrivateLayout = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <NavigationBar
      logoText="企业门户"
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