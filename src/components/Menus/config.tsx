import * as React from 'react';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

export const items: MenuItem[] = [
  {
    label: <Link to="/switch-time">时间转换工具</Link>,
    key: 'mail',
  },
  {
    label: <Link to="/about">About</Link>,
    key: 'app',
  }
];