import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import Dashboard from "./pages/companies/CompaniesShowAll"
import { Profile } from "./components/profile/Profile"
import { AuthRedirect } from "./components/AuthRedirect"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        } />
        <Route path="/register" element={
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        } />
        <Route path="/forgot-password" element={
          <AuthRedirect>
            <ForgotPassword />
          </AuthRedirect>
        } />
        <Route path="/reset-password" element={
          <AuthRedirect>
            <ResetPassword />
          </AuthRedirect>
        } />
        <Route path="/dashboard" element={
          <AuthRedirect>
            <Dashboard />
          </AuthRedirect>
        } />
        <Route path="/profile" element={
          <AuthRedirect>
            <Profile />
          </AuthRedirect>
        } />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
