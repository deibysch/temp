import { Badge } from "@/components/ui/badge"
import {
  Settings,
  HelpCircle,
  GaugeCircle,
  Package,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { ALIASES } from "@/constants/routeAliases";


type MenuSidebarProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
  usersCount?: number
}

export default function MenuSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  usersCount,
}: MenuSidebarProps) {
  const navigate = useNavigate();
  const params = useParams();
  const companyId = params.companyId; // obtiene el companyId de la URL

  const menuSections = [
    {
      title: "Principal",
      items: [
        { id: "dashboard", icon: GaugeCircle, label: "Dashboard", badge: null, path: ALIASES.ADMIN.DASHBOARD.replace(":companyId", companyId || "") },
        { id: "products", icon: Package, label: "Productos", badgeKey: "productsCount", path: ALIASES.ADMIN.PRODUCTS.replace(":companyId", companyId || "") },
      ],
    },
    {
      title: "Configuración",
      items: [
        { id: "settings", icon: Settings, label: "Ajustes", badge: null, path: ALIASES.ADMIN.SETTINGS.replace(":companyId", companyId || "") },
        { id: "help", icon: HelpCircle, label: "Ayuda", badge: null, path: ALIASES.ADMIN.HELP.replace(":companyId", companyId || "") },
      ],
    },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center flex-shrink-0 w-full">
          <img
            src="/images/ahorraya-logo-horizontal.png"
            alt="AhorraYa Logo"
            className="w-[150px]"
          />
        </div>
      </div>
      <nav className="p-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                let badge = item.badge
                if (item.badgeKey === "usersCount") badge = usersCount?.toString()
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setSidebarOpen(false)
                      if (item.path) navigate(item.path)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === item.id
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge && (
                      <Badge
                        variant={activeSection === item.id ? "default" : "secondary"}
                        className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                      >
                        {badge}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
