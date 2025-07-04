"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from "lucide-react"
import MenuSidebar from "@/layouts/MenuSU"
import * as usersApi from "./usersApi"
import * as companiesApi from "../companies/companiesApi"
import * as rolesApi from "../roles/rolesApi"
import Header from "@/layouts/Header"
import UserFormDialog from "./EditRoleFromUserDialog"
import PanelCRUD, { PanelCRUDColumn, PanelCRUDAction } from "@/components/PanelCRUD"

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

type CompanyOption = {
  id: number
  name: string
}

export default function Page() {
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("users")
  const [userFormDialogOpen, setUserFormDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null)
  const [allRoles, setAllRoles] = useState<RoleOption[]>([])
  const [selectedRoles, setSelectedRoles] = useState<{ [companyId: string]: string[] }>({})
  const [allCompanies, setAllCompanies] = useState<CompanyOption[]>([])

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
    fetchCompanies()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [userSearchTerm])

  const fetchUsers = async () => {
      const data = await usersApi.getUsersWithRoles() as UserWithRoles[]
      setUsers(data)
  }

  const fetchRoles = async () => {
    const data = await rolesApi.getRoles()
    setAllRoles(data as RoleOption[])
  }

  const fetchCompanies = async () => {
    const data = await companiesApi.getCompanies() as CompanyOption[]
    setAllCompanies(data)
  }

  const handleEditRoles = (user: UserWithRoles) => {
    setEditingUser(user)
    setSelectedRoles({ ...user.roles_by_company })
    setUserFormDialogOpen(true)
  }

  // Guardar cambios de roles
  const handleSaveRoles = async () => {
    if (!editingUser) return
    setUserFormDialogOpen(false)
    setEditingUser(null)
    fetchUsers()
  }

  const columns: PanelCRUDColumn<UserWithRoles>[] = [
    { key: "email", label: "Email" },
    {
      key: "roles_by_company",
      label: "Roles",
      render: (user) => (
        <div>
          {Object.entries(user.roles_by_company).map(([companyId, roles]) => {
            const companyName =
              companyId === "global"
                ? "Global"
                : allCompanies.find(c => String(c.id) === companyId)?.name || `Empresa ${companyId}`;
            return (
              <div key={companyId}>
                <span className="text-xs text-muted-foreground">{companyName}:</span>{" "}
                <span>{roles.join(", ")}</span>
              </div>
            )
          })}
        </div>
      ),
    },
  ]

  const actions: PanelCRUDAction<UserWithRoles>[] = [
    {
      label: "Editar roles",
      onClick: handleEditRoles,
      icon: <Edit className="h-4 w-4" />,
      className: "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <MenuSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        usersCount={users.length}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Usuarios y Roles" onSidebarOpen={() => setSidebarOpen(true)} />
        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <PanelCRUD
            title="Usuarios y Roles"
            data={paginatedUsers}
            columns={columns}
            actions={actions}
            loading={false}
            searchValue={userSearchTerm}
            onSearchChange={setUserSearchTerm}
            showSearch={true}
            showAddButton={false}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            renderMobileCard={(user) => (
              <Card key={user.id} className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.email}</h3>
                      <div className="mt-1 space-y-1">
                        {Object.entries(user.roles_by_company).map(([companyId, roles]) => {
                          const companyName =
                            companyId === "global"
                              ? "Global"
                              : allCompanies.find(c => String(c.id) === companyId)?.name || `Empresa ${companyId}`;
                          return (
                            <div key={companyId} className="text-xs text-muted-foreground">
                              <span className="font-semibold">{companyName}:</span>{" "}
                              <span>{roles.join(", ")}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRoles(user)}
                      className="border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <Edit className="h-4 w-4 mr-1" />Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            noResultsText="No hay usuarios"
          />
          <UserFormDialog
            open={userFormDialogOpen}
            setOpen={setUserFormDialogOpen}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            allRoles={allRoles}
            allCompanies={allCompanies}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            onSave={handleSaveRoles}
            fetchUsers={fetchUsers}
          />
        </main>
      </div>
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
