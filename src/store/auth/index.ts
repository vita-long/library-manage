import { createSlice } from '@reduxjs/toolkit';
import { tokenManager } from '@/utils/token';
import { userManager } from '@/utils/user';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: !!tokenManager.getToken(),
    user: userManager.getUser()
  },
  reducers: {
    logout: (state) => {
      tokenManager.clearToken();
      userManager.clearUser();
      state.isAuth = false;
      state.user = null;
      window.location.href = '/login';
    },
    login: (state, action) => {
      tokenManager.setToken(action.payload.token);
      if (action.payload.user) {
        userManager.setUser(action.payload.user);
      }
      state.isAuth = true;
      state.user = action.payload.user;
    },
    updateAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const authActions = authSlice.actions;

const reducer = authSlice.reducer;

export default reducer;
