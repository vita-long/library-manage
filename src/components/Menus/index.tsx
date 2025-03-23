import * as React from 'react';
import { Menu } from '@/commons/antd';
import { items } from './config';

const Menus = () => {

  return (
    <Menu mode="horizontal" items={items} />
  );
};

export default Menus;