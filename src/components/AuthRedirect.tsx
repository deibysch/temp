import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Lista de rutas protegidas
  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    const isProtectedRoute = protectedRoutes.includes(location.pathname)
    
    // Solo redirigir al dashboard si hay token y NO estamos en una ruta protegida
    if (token && !isProtectedRoute) {
      navigate("/dashboard")
    }
  }, [navigate, location.pathname])
  
  return <>{children}</>
}
