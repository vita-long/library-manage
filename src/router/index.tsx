import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { allRoutes, CustomRoute } from './routers';
import ProtectRoute from './protect-route';

// 路由转换器
const transformRoutes = (routes: CustomRoute[]) => {
  return routes.map(route => {
    const element = route.auth ? (
      <ProtectRoute>{route.element}</ProtectRoute>
    ) : (
      route.element
    );

    return (
      <Route
        key={route.key}
        path={route.path}
        element={element}
      >
        {route.children && transformRoutes(route.children)}
      </Route>
    );
  });
};

// 创建路由实例
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {transformRoutes(allRoutes)}
    </Route>
  )
);