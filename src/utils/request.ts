interface ResponseResult<T = any> {
  code: number;
  data: T | null;
  message: string;
}

interface UploadOptions {
  files: File | File[];
  data?: Record<string, any>;
  fieldName?: string;
  headers?: Record<string, any>;
}

class HttpRequest {
  /**
   * 基础请求方法
   * @param method 请求方法
   * @param url 请求地址
   * @param data 请求数据
   * @param headers 自定义请求头
   */
  async request<T>(
    method: string,
    url: string,
    data?: Record<string, any> | FormData,
    headers: Record<string, string> = {}
  ): Promise<ResponseResult<T>> {
    const config: Record<string, any> = {
      method: method.toUpperCase(),
      headers: {
        ...headers
      }
    };
    if (!(data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // 处理 GET 请求参数
    if (method.toUpperCase() === 'GET' && data && !(data instanceof FormData)) {
      const params = new URLSearchParams(data as Record<string, any>).toString();
      url += `?${params}`;
    }

    // 处理非 GET 请求 body
    if (method.toUpperCase() !== 'GET' && data) {
      config.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');

      // 处理响应数据
      let responseData: any = null;
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // 处理非 200 状态码
      if (!response.ok) {
        return {
          code: response.status,
          data: null,
          message: responseData.message || response.statusText
        };
      }

      return {
        code: response.status,
        data: responseData,
        message: 'Success'
      };
    } catch (error) {
      // 处理网络错误
      return {
        code: 0,
        data: null,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param headers 请求头
   */
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<ResponseResult<T>> {
    return this.request<T>('GET', url, params, headers);
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param headers 请求头
   */
  post<T = any>(url: string, data?: Record<string, any>, headers?: Record<string, string>): Promise<ResponseResult<T>> {
    return this.request<T>('POST', url, data, headers);
  }

  /**
   * 文件上传请求
   * @param url 上传地址
   * @param options 上传配置
   */
  upload<T>(url: string, options: UploadOptions): Promise<ResponseResult<T>> {
    const { files, data = {}, fieldName = 'file', headers = {} } = options;
    const formData = new FormData();

    // 处理文件字段
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append(fieldName, file));
    } else {
      formData.append(fieldName, files);
    }

    // 处理附加数据
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.request<T>('POST', url, files, headers);
  }
}

export default new HttpRequest();
