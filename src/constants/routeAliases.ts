export const ALIASES = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL_LINK: "/verify-email",
  PROFILE: "/profile",

  SU: {
    DASHBOARD: "/su/dashboard",
    CATEGORIES: "/su/categories",
    COMPANIES: "/su/companies",
    USERS: "/su/users",
    ROLES: "/su/roles",
    SETTINGS: "/su/settings",
    HELP: "/su/help",
  },

  ADMIN: {
    DASHBOARD: "/business/:companyId/dashboard",
    PRODUCTS: "/business/:companyId/products",
    USERS: "/business/:companyId/users",
    SETTINGS: "/business/:companyId/settings",
    HELP: "/business/:companyId/help",
  }
};
