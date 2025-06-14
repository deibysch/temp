"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import MenuSidebar from "@/layouts/Menu"
import * as usersApi from "./usersApi"
import Header from "@/layouts/Header"

// Tipos para usuario y roles
type UserWithRoles = {
  id: number
  email: string
  roles_by_company: {
    [companyId: string]: string[] // companyId puede ser 'global' o id numérico
  }
}

type RoleOption = {
  id: number
  name: string
}

export default function Page() {
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("users")
  const [editRolesDialogOpen, setEditRolesDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null)
  const [allRoles, setAllRoles] = useState<RoleOption[]>([])
  const [selectedRoles, setSelectedRoles] = useState<{ [companyId: string]: string[] }>({})

  const itemsPerPage = 6

  // Filtrado de usuarios
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
    )
  }, [users, userSearchTerm])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [userSearchTerm])

  const fetchUsers = async () => {
    const data = await usersApi.getUsersWithRoles()
    setUsers(data)
  }

  // Simula fetch de roles (puedes cambiar por un endpoint real si existe)
  const fetchRoles = async () => {
    // Ejemplo estático, reemplaza por GET a /roles si existe
    setAllRoles([
      { id: 1, name: "su" },
      { id: 2, name: "admin" },
      { id: 3, name: "user" },
    ])
  }

  const handleEditRoles = (user: UserWithRoles) => {
    setEditingUser(user)
    setSelectedRoles({ ...user.roles_by_company })
    setEditRolesDialogOpen(true)
  }

  const handleRoleChange = (companyId: string, roleName: string, checked: boolean) => {
    setSelectedRoles((prev) => {
      const current = prev[companyId] || []
      return {
        ...prev,
        [companyId]: checked
          ? [...current, roleName]
          : current.filter((r) => r !== roleName),
      }
    })
  }

  const handleSaveRoles = async () => {
    if (!editingUser) return
    // Para cada companyId y rol, compara con los roles actuales y llama a la API si hay cambios
    const prevRoles = editingUser.roles_by_company
    for (const companyId in selectedRoles) {
      const prev = prevRoles[companyId] || []
      const next = selectedRoles[companyId] || []
      // Roles a agregar
      for (const roleName of next) {
        if (!prev.includes(roleName)) {
          const role = allRoles.find((r) => r.name === roleName)
          if (role) {
            await usersApi.addRoleToUser(editingUser.id, {
              role_id: role.id,
              company_id: companyId === "global" ? null : Number(companyId),
            })
          }
        }
      }
      // Roles a quitar
      for (const roleName of prev) {
        if (!next.includes(roleName)) {
          const role = allRoles.find((r) => r.name === roleName)
          if (role) {
            await usersApi.removeRoleFromUser(editingUser.id, {
              role_id: role.id,
              company_id: companyId === "global" ? null : Number(companyId),
            })
          }
        }
      }
    }
    setEditRolesDialogOpen(false)
    setEditingUser(null)
    fetchUsers()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <MenuSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        categoriesCount={users.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          title="Usuarios y Roles"
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Desktop Table */}
            <Card className="border-0 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-medium text-green-600 dark:text-green-400">
                        Email
                      </TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">
                        Roles
                      </TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="border-b hover:bg-green-50 dark:hover:bg-emerald-900/70 transition-colors">
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          {Object.entries(user.roles_by_company).map(([companyId, roles]) => (
                            <div key={companyId}>
                              <span className="text-xs text-muted-foreground">
                                {companyId === "global" ? "Global" : `Empresa ${companyId}`}:
                              </span>{" "}
                              <span>
                                {roles.join(", ")}
                              </span>
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditRoles(user)}
                            className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          >
                            <Edit className="h-4 w-4" /> Editar roles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  Visualizando registros {(currentPage - 1) * itemsPerPage + 1}
                  –
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  {" de "}
                  {filteredUsers.length}
                </span>
              </div>
            )}

            {/* Dialogo para editar roles */}
            {editRolesDialogOpen && editingUser && (
              <EditRolesDialog
                open={editRolesDialogOpen}
                setOpen={setEditRolesDialogOpen}
                user={editingUser}
                allRoles={allRoles}
                selectedRoles={selectedRoles}
                setSelectedRoles={setSelectedRoles}
                onSave={handleSaveRoles}
              />
            )}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

// Componente para editar roles de usuario
type EditRolesDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  user: UserWithRoles
  allRoles: RoleOption[]
  selectedRoles: { [companyId: string]: string[] }
  setSelectedRoles: React.Dispatch<React.SetStateAction<{ [companyId: string]: string[] }>>
  onSave: () => void
}

// Componente para editar roles de usuario
const EditRolesDialog: React.FC<EditRolesDialogProps> = ({
  open,
  setOpen,
  user,
  allRoles,
  selectedRoles,
  setSelectedRoles,
  onSave,
}) => {
  // Obtén todos los companyId (incluyendo 'global')
  const companyIds = Object.keys({ ...user.roles_by_company, ...selectedRoles })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Editar roles de {user.email}</h2>
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {companyIds.map(companyId => (
            <div key={companyId}>
              <div className="font-medium text-sm mb-1">
                {companyId === "global" ? "Global" : `Empresa ${companyId}`}
              </div>
              <div className="flex flex-wrap gap-3">
                {allRoles.map(role => (
                  <label key={role.id} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedRoles[companyId]?.includes(role.name) || false}
                      onChange={e => {
                        setSelectedRoles(prev => {
                          const current = prev[companyId] || []
                          return {
                            ...prev,
                            [companyId]: e.target.checked
                              ? [...current, role.name]
                              : current.filter(r => r !== role.name)
                          }
                        })
                      }}
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700">
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
