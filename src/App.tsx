import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useListenStorage } from '@/hooks/listen-storage';
import { router } from '@/router';
import store from '@/store';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Provider } from 'react-redux';

const App = () => {
  useListenStorage();
  console.log(111);
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  );
};

export default App;