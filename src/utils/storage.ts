interface StorageData<T> {
  value: T;
  expire?: number;
}

enum StorageErrorType {
  QuotaExceeded = 'QuotaExceeded',
  Disabled = 'Disabled',
  InvalidValue = 'InvalidValue',
  Expired = 'Expired',
}

export class StorageError extends Error {
  type: StorageErrorType;

  constructor(message: string, type: StorageErrorType) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
  }
}

class SafeStorage {
  private prefix = 'library_';

  /**
   * 安全存储数据
   * @param key 存储键名（自动添加前缀）
   * @param value 存储值
   * @param expire 过期时间（单位：秒）
   */
  set<T>(key: string, value: T, expire?: number): void {
    try {
      const data: StorageData<T> = {
        value,
        expire: expire ? Date.now() + expire * 1000 : Date.now() + 600 * 1000,
      };
      const stringValue = JSON.stringify(data);
      
      if (stringValue === undefined) {
        throw new StorageError('无效的存储值', StorageErrorType.InvalidValue);
      }
      
      localStorage.setItem(this.prefix + key, stringValue);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError('存储空间不足', StorageErrorType.QuotaExceeded);
      }
      throw error;
    }
  }

  /**
   * 获取存储数据（自动处理过期和类型转换）
   * @param key 存储键名
   * @param defaultValue 默认值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return defaultValue || null;

      const data = JSON.parse(item) as StorageData<T>;
      
      // 检查过期
      if (data.expire && Date.now() > data.expire) {
        this.remove(key);
        throw new StorageError('数据已过期', StorageErrorType.Expired);
      }
      
      return data.value;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('存储数据解析失败:', error);
        this.remove(key);
      }
      return defaultValue || null;
    }
  }

  /**
   * 移除存储项
   * @param key 存储键名
   */
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * 清空所有带前缀的存储项
   */
  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  getPrefixKey(key: string): string {
    return this.prefix + key;
  }

  /**
   * 检测存储是否可用
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// 创建单例实例
export const storage = new SafeStorage();