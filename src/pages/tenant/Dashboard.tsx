import React, { useState } from "react"
import Header from "@/layouts/Header"
import MenuSidebar from "@/layouts/MenuBusiness"


export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <MenuSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          title="Dashboard"
          onSidebarOpen={() => setSidebarOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              ¡Hola!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Estamos trabajando para traerte nuevas funcionalidades en el Dashboard.
            </p>
            <p className="text-gray-500 dark:text-gray-400 font-semibold">
              Próximamente habrá novedades.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
