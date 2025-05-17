const routes = {
  public: {
    register: 'register',
    login: 'login',
    home: '/',
    logout: 'logout',
    forgotPassword: 'forgot-password',
    verifyRestore: 'verify-restore',
  },
  private: {
    account: '/manager/account',
    users: '/manager/users',
    banners: '/manager/banners',
  },
  protected: {
    google: '/auth/google/login',
  },
};

export default routes;
