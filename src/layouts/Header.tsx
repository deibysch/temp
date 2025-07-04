import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"
import { UserAvatar } from "@/components/profile/UserAvatar"
import { useMemo } from "react"
import { Navigate } from "react-router-dom"
import Login from "../pages/auth/Login"

interface HeaderProps {
  title: string
  onSidebarOpen: () => void
}

const STORAGE_VERSION = 'v1';

if (localStorage.getItem('storageVersion') !== STORAGE_VERSION) {
  localStorage.clear();
  localStorage.setItem('storageVersion', STORAGE_VERSION);
}

export default function Header({
  title,
  onSidebarOpen,
}: HeaderProps) {
  const localUser = useMemo(() => {
      const userStr = localStorage.getItem("user")
      if (!userStr)
        return <Navigate to={Login} replace />;
      return JSON.parse(userStr);
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onSidebarOpen}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-green-600 dark:text-green-400">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <UserAvatar
            user={localUser}
          />
        </div>
      </div>
    </header>
  )
}
