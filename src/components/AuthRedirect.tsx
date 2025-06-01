import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard")
    }
  }, [navigate])
  return <>{children}</>
}
