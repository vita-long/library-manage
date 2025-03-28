import { USER_INFO } from '@/commons/constants';
import { storage } from './storage';

export type User = {
  id: string;
  userName: string;
  email: string;
  avator: string;
};

let userInfo: string | null = null;

export const userManager = {
  setUser: (user: User) => {
    userInfo = JSON.stringify(user);
    storage.set(USER_INFO, JSON.stringify(user));
  },
  clearUser: () => {
    userInfo = null;
    storage.remove(USER_INFO);
  },
  getUser: () => JSON.parse(userInfo || storage.get<string>(USER_INFO) || 'null')
};
