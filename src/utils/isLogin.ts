function isLogin() {
  const loginToken = localStorage.getItem('login_manage_toekn');
  if (loginToken) {
    return true;
  }
  return false;
}

export {
  isLogin
};
