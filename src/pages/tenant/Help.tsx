import React, { useState } from "react"
import Header from "@/layouts/Header"
import MenuSidebar from "@/layouts/MenuBusiness"


export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("help")

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
          title="Ayuda"
          onSidebarOpen={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
          <section className="mt-10 space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Centro de Ayuda</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-base">
                Encuentra respuestas rápidas o contáctanos si necesitas asistencia personalizada.
              </p>
              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Preguntas Frecuentes</h3>
                  <ul className="space-y-5">
                    <li className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">¿Cómo cambio el tema de la aplicación?</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Ve a la sección de <b>Ajustes</b> y selecciona el tema que prefieras (claro, oscuro o sistema).
                      </p>
                    </li>
                    <li className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">¿Cómo contacto al soporte?</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Puedes escribirnos a <a href="mailto:ahorrayascz@gmail.com" className="text-blue-600 dark:text-blue-400 underline">ahorrayascz@gmail.com</a> o enviarnos un mensaje por <a href="https://wa.me/59162325758" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 underline">WhatsApp</a>.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contacto</h3>
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <a
                  href="https://wa.me/59162325758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-md transition shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16.72 13.06c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.7-.7 1.94-1.37.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
                <a
                  href="mailto:ahorrayascz@gmail.com"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-md transition shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4" />
                  </svg>
                  Contactar por correo
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * No es posible enviar mensajes directamente desde el sitio. Usa WhatsApp o correo electrónico para contactarnos.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
