const routes = {
  public: {
    register: 'register',
    login: 'login',
    home: '/',
    logout: 'logout',
  },
  private: {},
  protected: {
    google: '/auth/google/login',
  },
};

export default routes;
