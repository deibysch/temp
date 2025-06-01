import { Routes, Route } from "react-router-dom"
import Home from "./pages/auth/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import { AuthRedirect } from "./components/AuthRedirect"

function App() {
  return (
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
