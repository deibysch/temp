import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import { Profile } from "./pages/auth/Profile";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./hooks/useAuth";
import VerifyEmail from "./pages/auth/VerifyEmailLink";
import Settings from "./pages/su/Settings";
import Help from "./pages/su/Help";
import { ALIASES } from "./constants/routeAliases";

function ProtectedRoute({ role, redirectPath = ALIASES.LOGIN }: { role: string, redirectPath?: string }) {
  const { hasAnyRole } = useAuth();
  if (!hasAnyRole(role)) {
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
        <Route element={<AuthRedirect />}>
          <Route path={ALIASES.LOGIN} element={<Login />} />
          <Route path={ALIASES.REGISTER} element={<Register />} />
          <Route path={ALIASES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ALIASES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute role="SUPER_USUARIO" redirectPath={ALIASES.LOGIN} />}>
          <Route path={ALIASES.SU.DASHBOARD} element={<DashboardFromSU />} />
          <Route path={ALIASES.SU.CATEGORIES} element={<CategoriesFromSU />} />
          <Route path={ALIASES.SU.COMPANIES} element={<CompaniesFromSU />} />
          <Route path={ALIASES.SU.USERS} element={<UsersFromSU />} />
          <Route path={ALIASES.SU.ROLES} element={<RolesFromSU />} />
          <Route path={ALIASES.SU.PROFILE} element={<Profile />} />
          <Route path={ALIASES.SU.SETTINGS} element={<Settings />} />
          <Route path={ALIASES.SU.HELP} element={<Help />} />
        </Route>
        <Route element={<ProtectedRoute role="ADMIN_EMPRESA" redirectPath={ALIASES.LOGIN} />}>
          <Route path={ALIASES.ADMIN.DASHBOARD} element={<DashboardFromSU />} />
          <Route path={ALIASES.ADMIN.USERS} element={<UsersFromSU />} />
          <Route path={ALIASES.ADMIN.PROFILE} element={<Profile />} />
          <Route path={ALIASES.ADMIN.SETTINGS} element={<Settings />} />
          <Route path={ALIASES.ADMIN.HELP} element={<Help />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
