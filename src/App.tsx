import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import { ALIASES } from "./constants/routeAliases";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import DashboardFromSU from "./pages/su/Dashboard";
import CategoriesFromSU from "./pages/su/categories/CategoriesPage";
import CompaniesFromSU from "./pages/su/companies/CompaniesPage";
import UsersFromSU from "./pages/su/users/UsersPage";
import RolesFromSU from "./pages/su/roles/RolesPage";
import SettingsFromSu from "./pages/su/Settings";
import { Profile } from "./pages/auth/Profile";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./hooks/useAuth";
import VerifyEmail from "./pages/auth/VerifyEmailLink";
import HelpFromTenant from "./pages/tenant/Help";
import SettingsFromTenant from "./pages/tenant/Settings";
import DashboardFromTenant from "./pages/tenant/Dashboard";
import ProductsPage from "./pages/tenant/products/ProductsPage";

function ProtectedRouteForAdminBusiness({ redirectPath }: { redirectPath: string }) {
  const { userHasBusinessLevelRoleFor } = useAuth();
  const params = useParams();
  const companyId = Number(params.companyId);
  if (!userHasBusinessLevelRoleFor(companyId)) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}

function ProtectedRoutedForDeveloper({ redirectPath }: { redirectPath: string }) {
  const { getRolesDeveloper } = useAuth();
  if (getRolesDeveloper().length == 0) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}

function AuthRedirect() {
  const { getRedirectPathForRole } = useAuth();
  const path = getRedirectPathForRole();
  if (path!=""){
    return <Navigate to={path} replace />;
  }
  else{
    return <Outlet />;
  }
}

function App() {
  return (
    <>
      <Routes>
        <Route path={ALIASES.HOME} element={<Home />} />
        <Route path={`${ALIASES.VERIFY_EMAIL_LINK}/:id/:hash`} element={<VerifyEmail />} />
        <Route path={ALIASES.PROFILE} element={<Profile />} />
        <Route element={<AuthRedirect />}>
          <Route path={ALIASES.LOGIN} element={<Login />} />
          <Route path={ALIASES.REGISTER} element={<Register />} />
          <Route path={ALIASES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ALIASES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoutedForDeveloper redirectPath={ALIASES.LOGIN} />}>
          <Route path={ALIASES.SU.DASHBOARD} element={<DashboardFromSU />} />
          <Route path={ALIASES.SU.CATEGORIES} element={<CategoriesFromSU />} />
          <Route path={ALIASES.SU.COMPANIES} element={<CompaniesFromSU />} />
          <Route path={ALIASES.SU.USERS} element={<UsersFromSU />} />
          <Route path={ALIASES.SU.ROLES} element={<RolesFromSU />} />
          <Route path={ALIASES.SU.SETTINGS} element={<SettingsFromSu />} />
        </Route>
        <Route element={<ProtectedRouteForAdminBusiness redirectPath={ALIASES.LOGIN} />}>
          <Route path={ALIASES.ADMIN.DASHBOARD} element={<DashboardFromTenant />} />
          <Route path={ALIASES.ADMIN.PRODUCTS} element={<ProductsPage />} />
          <Route path={ALIASES.ADMIN.SETTINGS} element={<SettingsFromTenant />} />
          <Route path={ALIASES.ADMIN.HELP} element={<HelpFromTenant />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
