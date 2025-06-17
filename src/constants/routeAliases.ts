export const ALIASES = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL_LINK: "/verify-email",

  SU: {
    DASHBOARD: "/su/dashboard",
    CATEGORIES: "/su/categories",
    COMPANIES: "/su/companies",
    USERS: "/su/users",
    ROLES: "/su/roles",
    PROFILE: "/su/profile",
    SETTINGS: "/su/settings",
    HELP: "/su/help",
  },

  ADMIN: {
    DASHBOARD: "/admin/:companyId/dashboard",
    PRODUCTS: "/admin/:companyId/products",
    USERS: "/admin/:companyId/users",
    PROFILE: "/admin/:companyId/profile",
    SETTINGS: "/admin/:companyId/settings",
    HELP: "/admin/:companyId/help",
  }
};
