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
    products: '/manager/products',
    categories: '/manager/categories',
    applyProduct: (id: string | number) => `/manager/categories/${id}/apply-product`,
    colorTypes: '/manager/color-types',
  },
  protected: {
    google: '/auth/google/login',
  },
};

export default routes;
