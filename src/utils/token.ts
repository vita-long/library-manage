import { LOGIN_TOKEN_STORAGE_KEY } from "@/commons/constants";
import { storage } from "./storage";

// 新增全局 token 管理
let authToken: string | null = null;

export const tokenManager = {
  setToken: (token: string) => {
    authToken = token;
    storage.set(LOGIN_TOKEN_STORAGE_KEY, token, 3600 * 2); // 2小时过期
  },
  clearToken: () => {
    authToken = null;
    storage.remove(LOGIN_TOKEN_STORAGE_KEY);
  },
  getToken: () => authToken || storage.get<string>(LOGIN_TOKEN_STORAGE_KEY)
};
