import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/companies/CompaniesShowAll";
import { Profile } from "./pages/auth/Profile";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./hooks/useAuth";
import VerifyEmail from "./pages/auth/VerifyEmailLink";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

function ProtectedRoute({ role, redirectPath = "/login" }: { role: string, redirectPath?: string }) {
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
    return <Navigate to={getRedirectPathForRole()} replace />;
  }
  else{
    return <Outlet />;
  }
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute role="su" redirectPath="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
        <Route path="/verify-email/:id/:hash" element={<VerifyEmail />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
