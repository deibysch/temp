import React, { useState } from "react";
import Header from "@/layouts/Header";
import MenuSidebar from "@/layouts/Menu";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/theme-provider";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("settings");
  const { theme, setTheme } = useTheme();

  // Estado para edición
  const [editing, setEditing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const handleEdit = () => {
    setEditing(true);
    setSelectedTheme(theme);
  };

  const handleSave = () => {
    setTheme(selectedTheme);
    setEditing(false);
  };

  const handleCancel = () => {
    setSelectedTheme(theme);
    setEditing(false);
  };

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
          title="Configuración"
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
          <div className="space-y-12 mt-12">
            {/* Ajustes de la aplicación */}
            <section>
              <h2 className="text-2xl font-semibold mb-1 text-gray-900 dark:text-gray-100">Ajustes de la aplicación</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Personaliza la apariencia y el comportamiento de la aplicación según tus preferencias.
              </p>
              <hr className="border-gray-200 dark:border-gray-700 mb-8" />
              {/* Tema */}
              <div>
                <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Tema</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Selecciona el modo de color que prefieras para la interfaz.
                </p>
                <RadioGroup
                  value={selectedTheme}
                  onValueChange={editing ? setSelectedTheme : undefined}
                  className="flex gap-6"
                  disabled={!editing}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" disabled={!editing} />
                    <label htmlFor="theme-light" className="ml-2 text-gray-700 dark:text-gray-200">Claro</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" disabled={!editing} />
                    <label htmlFor="theme-dark" className="ml-2 text-gray-700 dark:text-gray-200">Oscuro</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" disabled={!editing} />
                    <label htmlFor="theme-system" className="ml-2 text-gray-700 dark:text-gray-200">Sistema</label>
                  </div>
                </RadioGroup>
                <div className="flex gap-3 mt-6">
                  {!editing && (
                    <Button onClick={handleEdit} variant="default" className="w-28">
                      Editar
                    </Button>
                  )}
                  {editing && (
                    <>
                      <Button onClick={handleSave} variant="default" className="w-28">
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="w-28">
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}