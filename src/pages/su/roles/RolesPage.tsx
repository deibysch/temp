"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import MenuSidebar from "@/layouts/MenuSU"
import * as rolesApi from "./rolesApi"
import RoleFormDialog from "./RoleFormDialog"
import RoleDeleteDialog from "./RoleDeleteDialog"
import Header from "@/layouts/Header"

type Role = {
  id: number
  name: string
  permissions?: string[]
}

export default function Page() {
  const [roles, setRoles] = useState<Role[]>([])
  const [roleSearchTerm, setRoleSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roleFormData, setRoleFormData] = useState<Partial<Role>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("roles")
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const itemsPerPage = 6

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(roleSearchTerm.toLowerCase())
    )
  }, [roles, roleSearchTerm])

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRoles, currentPage])

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)

  useEffect(() => {
    fetchRoles()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [roleSearchTerm])

  const fetchRoles = async () => {
    const data = await rolesApi.getRoles()
    setRoles(data)
  }

  const handleRoleSubmit = async (e: React.FormEvent, selectedPermissions: string[]) => {
    e.preventDefault()
    try {
      if (editingRole) {
        await rolesApi.updateRole(editingRole.id, { name: roleFormData.name || "", permissions: selectedPermissions })
      } else {
        await rolesApi.createRole({ name: roleFormData.name || "", permissions: selectedPermissions })
      }
      setRoleDialogOpen(false)
      setEditingRole(null)
      setRoleFormData({})
      fetchRoles()
    } catch (error) {}
  }

  const handleEditRole = async (role: Role) => {
    // Obtener permisos actuales del rol
    try {
      const data = await rolesApi.getRole(role.id)
      setEditingRole({ ...role, permissions: data.permissions || [] })
      setRoleFormData({ id: role.id, name: role.name })
      setRoleDialogOpen(true)
    } catch {
      setEditingRole(role)
      setRoleFormData(role)
      setRoleDialogOpen(true)
    }
  }

  const handleDeleteRoleClick = (role: Role) => {
    setRoleToDelete(role)
    setDeleteRoleDialogOpen(true)
  }

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete) return
    try {
      await rolesApi.deleteRole(roleToDelete.id)
      fetchRoles()
    } catch (error) {
    } finally {
      setDeleteRoleDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const openAddRoleDialog = () => {
    setEditingRole(null)
    setRoleFormData({})
    setRoleDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <MenuSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        rolesCount={roles.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          title="Roles"
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar roles..."
                  value={roleSearchTerm}
                  onChange={(e) => setRoleSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={openAddRoleDialog} className="bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700">
                  + Nuevo Rol
                </Button>
                <RoleFormDialog
                  open={roleDialogOpen}
                  setOpen={setRoleDialogOpen}
                  editingRole={editingRole}
                  setEditingRole={setEditingRole}
                  formData={roleFormData}
                  setFormData={setRoleFormData}
                  onSubmit={handleRoleSubmit}
                  openAddDialog={openAddRoleDialog}
                />
              </div>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block border-0 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-medium text-green-600 dark:text-green-400 w-24">ID</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Nombre</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRoles.map((role) => (
                      <TableRow key={role.id} className="border-b hover:bg-green-50 dark:hover:bg-emerald-900/70 transition-colors">
                        <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400">{role.id}</TableCell>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditRole(role)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRoleClick(role)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paginatedRoles.map((role) => (
                <Card
                  key={role.id}
                  className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{role.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRole(role)}
                        className="flex-1 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteRoleClick(role)}
                        className="flex-1 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
                  {Math.min(currentPage * itemsPerPage, filteredRoles.length)}
                  {" de "}
                  {filteredRoles.length}
                </span>
              </div>
            )}
            <RoleDeleteDialog
              open={deleteRoleDialogOpen}
              setOpen={setDeleteRoleDialogOpen}
              role={roleToDelete}
              onConfirm={handleConfirmDeleteRole}
            />
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
