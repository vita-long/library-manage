import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';
import { getCookie } from './cookie';
import { tokenManager } from './token';
export type CError = AxiosError;

// 基础响应类型
interface BaseResponse<T> {
  code: number;
  data: T;
  msg?: string;
}

// 扩展请求配置
interface RequestConfig extends AxiosRequestConfig {
  // 是否显示全局loading
  showLoading?: boolean;
  // 是否处理错误（全局错误处理）
  handleError?: boolean;
  // 重试次数
  retry?: number;
}

// 上传参数配置
interface UploadConfig extends RequestConfig {
  // 上传文件字段名（默认file）
  fileFieldName?: string;
}

const messages: Record<number, string> = {
  400: '请求参数错误',
  401: '登录状态已过期，请重新登录',
  403: '没有操作权限',
  404: '请求资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
};

class HttpRequest {
  private instance: AxiosInstance;
  private cancelTokenSource!: CancelTokenSource;

  constructor(baseConfig: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      timeout: 10000,
      headers: {
        // 'Content-Type': 'application/json;charset=UTF-8'
      },
      ...baseConfig
    });

    this.initInterceptors();
    this.renewCancelToken();
  }

  // 初始化拦截器
  private initInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // csrfToken
        const csrfToken = getCookie('XSRF-TOKEN');
        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        // 自动添加 authorization 头
        const token = tokenManager.getToken();
        if (token) {
          config.headers['authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(this.handleResponseSuccess, this.handleResponseError);
  }

  private handleResponseSuccess = (response: AxiosResponse) => {
    const res = response.data;
    // 业务逻辑错误处理
    if (res.code !== 0) {
      const error = new Error(res.msg);

      return Promise.reject(error);
    }

    return response;
  };

  private handleResponseError = async (error: AxiosError) => {
    const formatError = error;
    formatError.message = messages[error.status as number] || `未知HTTP错误 (${error.status})`;
    return Promise.reject(formatError);
  };

  // 生成新的cancelToken
  private renewCancelToken() {
    this.cancelTokenSource = axios.CancelToken.source();
  }

  // 通用请求方法
  public async request<T>(config: RequestConfig): Promise<AxiosResponse<BaseResponse<T>>> {
    try {
      const mergedConfig: RequestConfig = {
        cancelToken: this.cancelTokenSource.token,
        ...config
      };

      const response = await this.instance.request<BaseResponse<T>>(mergedConfig);
      return response;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      }
      throw error;
    }
  }

  // GET请求
  public get<P, T>(url: string, params?: P, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config
    }).then((res) => res.data.data);
  }

  // POST请求
  public post<P, T>(url: string, data?: P, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config
    }).then((res) => res.data.data);
  }

  /**
   * DELETE 请求方法
   * @param url 请求地址
   * @param params 查询参数（路径参数应包含在url中）
   * @param config 请求配置
   * P: 请求参数类型
   * T: 响应参数类型
   */
  public delete<P, T>(url: string, params?: P, config?: RequestConfig): Promise<T> {
    const requestConfig: RequestConfig = {
      method: 'DELETE',
      url,
      params: params instanceof URLSearchParams ? params : (params as P),
      ...config
    };

    return this.request<T>(requestConfig).then((res) => res.data.data);
  }

  /**
   * PUT 请求方法
   * @param url 请求地址
   * @param data 请求体数据
   * @param config axios配置
   * P: 请求参数类型
   * T: 响应参数类型
   */
  public put<P, T>(url: string, data?: P, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config
    }).then((res) => res.data.data);
  }

  // 文件上传
  public upload<T>(
    url: string,
    files: File | File[],
    data?: Record<string, string | Blob>,
    config?: UploadConfig
  ): Promise<T> {
    const formData = new FormData();
    const fileFieldName = config?.fileFieldName || 'file';
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append(fileFieldName, file);
      });
    } else {
      formData.append('file', files);
    }

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: files,
      ...config
    }).then((res) => res.data.data);
  }

  // 取消当前请求
  public cancel(message?: string) {
    this.cancelTokenSource.cancel(message);
    this.renewCancelToken();
  }
}

// 默认实例
const httpRequest = new HttpRequest();

export { HttpRequest, httpRequest as default };
