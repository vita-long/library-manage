import React, { lazy } from 'react';
import { Routes, Route, BrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/components/AuthContext';
// import { isLogin } from '@/utils/isLogin';
import Login from './pages/login';
import Register from './pages/register';
import { useListenStorage } from '@/hooks/listen-storage';

// 路由懒加载, 并命名
const Home = lazy(() =>  import(/* webpackChunkName: 'about' */ './pages/home'));
const NotFound = lazy(() =>  import(/* webpackChunkName: 'NotFound' */ '@/components/NotFound'));

// 路由守卫组件
const PrivateRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

// 是否已登录
const IsLoginRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/home" replace /> : <Outlet />;
};

const App = () => {
  useListenStorage();
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<IsLoginRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          {/* 未匹配路由重定向 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;