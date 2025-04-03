import { authActions } from '@/store/auth';
import { User } from '@/types/user';
import { useDispatch, useSelector } from 'react-redux';

const useAuthHooks = () => {
  const dispath = useDispatch();
  const { updateAuth, updateUser, logout, login } = authActions;

  const { isAuth, user } = useSelector((state: any) => state.auth);
  const updateLoginInfo = (token: string, user: User) => {
    dispath(updateAuth(token));
    dispath(updateUser(user));
  };

  const logIn = (data: { token: string, user: User}) => {
    dispath(login(data));
  };

  const logOut = () => {
    dispath(logout());
  };

  return {
    isAuth,
    user,
    logout: logOut,
    login: logIn,
    updateLoginInfo
  };
};

export default useAuthHooks;
