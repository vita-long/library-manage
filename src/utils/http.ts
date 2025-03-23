import { tokenManager } from "./token";

interface RequestOptions extends RequestInit {
  data?: Record<string, unknown>;
}

export async function http<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  // 自动添加 Authorization 头
  const token = tokenManager.getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: options.data ? JSON.stringify(options.data) : null,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.status === 401) {
      tokenManager.clearToken();
      window.location.href = '/login';
      throw new Error('会话已过期，请重新登录');
    }

    if (!response.ok) {
      return Promise.reject({
        status: response.status,
        message: data.message || '请求失败',
      });
    }

    if (data.code === 0) {
      return data.data as T;
    } else {
      return Promise.reject({
        status: data.code,
        message: data.msg || '请求失败',
        errors: data.errors
      });
    }
  } catch (error) {
    return Promise.reject({
      status: 500,
      message: '网络连接异常',
      error
    });
  }
}