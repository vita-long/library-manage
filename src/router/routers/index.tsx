
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Live from '@/pages/live';
import LivePlayer from '@/pages/live/live-player';
// import HlsPlayer from '@/pages/live/hls-player';
import Workbench from '@/pages/workbench';
const Home = lazy(() =>  import(/* webpackChunkName: 'about' */ '@/pages/home'));
const Upload = lazy(() =>  import(/* webpackChunkName: 'about' */ '@/pages/upload'));
const Books = lazy(() =>  import(/* webpackChunkName: 'books' */ '@/pages/books'));
const NotFound = lazy(() =>  import(/* webpackChunkName: 'NotFound' */ '@/components/NotFound'));


import { PrivateLayout } from '@/components/Page';

// 路由类型扩展（支持自定义属性）
export type CustomRoute = RouteObject & {
  key: string;
  auth?: boolean; // 是否需要认证
  roles?: string[]; // 角色权限（可选）
  meta?: {
    title?: string;
    icon?: React.ReactNode;
  };
  children?: CustomRoute[]
};


// 私有路由配置
export const routes: CustomRoute[] = [
  {
    path: '/',
    key: 'index',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/workbench',
    key: 'workbench',
    element: <Workbench />
  },
  {
    path: '/login',
    key: 'login',
    element: <Login />,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    key: 'register',
    element: <Register />,
    meta: {
      title: '注册'
    }
  },
  {
    path: '/dashboard',
    key: 'dashboard',
    element: <PrivateLayout />,
    auth: true,
    children: [
      {
        index: true,
        path: '/dashboard',
        key: 'dashboard-index',
        element: <Home />
      },
      {
        path: 'books',
        key: 'dashboard-books',
        element: <Books />
      },
      {
        path: 'upload',
        key: 'dashboard-upload',
        element: <Upload />
      },
      {
        path: 'live',
        key: 'live',
        element: <Live />
      },
      {
        path: 'live/:id',
        key: 'live-id',
        element: <LivePlayer />
      },
      {
        path: '*',
        key: 'dashboard-404',
        element: <NotFound />
      }
    ]
  }
];

// 组合所有路由
export const allRoutes: CustomRoute[] = [
  ...routes,
  {
    path: '*',
    key: '404',
    element: <NotFound />
  }
];