import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import * as rolesApi from "./rolesApi"

type Role = {
  id: number
  name: string
  permissions?: string[]
}

type Permission = {
  id: number
  name: string
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  editingRole: Role | null
  setEditingRole: (role: Role | null) => void
  formData: Partial<Role>
  setFormData: (data: Partial<Role>) => void
  onSubmit: (e: React.FormEvent, selectedPermissions: string[]) => void
  openAddDialog: () => void
}

const RoleFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  editingRole,
  setEditingRole,
  formData,
  setFormData,
  onSubmit,
  openAddDialog,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"alfabetico" | "accion" | "modulo">("modulo")

  useEffect(() => {
    if (open) {
      fetchPermissions()
    }
  }, [open])

  useEffect(() => {
    if (open) {
      if (editingRole && editingRole.permissions) {
        setSelectedPermissions(editingRole.permissions)
      } else {
        setSelectedPermissions([])
      }
    }
  }, [open, editingRole])

  const fetchPermissions = async () => {
    try {
      const data = await rolesApi.getPermissions()
      setPermissions(data)
    } catch {}
  }

  const handlePermissionChange = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName]
    )
  }

  const handleClose = () => {
    setOpen(false)
    setEditingRole(null)
    setFormData({})
    setSelectedPermissions([])
    setSearch("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, selectedPermissions)
  }

  // Agrupa permisos por las dos primeras partes del nombre
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const parts = perm.name.split("_")
    let groupKey = ""
    if (parts.length >= 2) {
      groupKey = parts[1] // agrupa por la segunda parte (ej: USUARIO, ROL, CATEGORIA, EMPRESA, etc)
    } else {
      groupKey = parts[0]
    }
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  // Filtra permisos por texto de búsqueda
  const filterPermissions = (perms: Permission[]) =>
    perms.filter((perm) =>
      perm.name.toLowerCase().includes(search.toLowerCase())
    )

  // Helpers para seleccionar todos los permisos de un grupo
  const isAllGroupSelected = (perms: Permission[]) =>
    perms.every(perm => selectedPermissions.includes(perm.name))

  const isSomeGroupSelected = (perms: Permission[]) =>
    perms.some(perm => selectedPermissions.includes(perm.name)) &&
    !isAllGroupSelected(perms)

  const handleSelectAllGroup = (group: string, perms: Permission[], checked: boolean) => {
    const permNames = perms.map(p => p.name)
    if (checked) {
      setSelectedPermissions(prev =>
        Array.from(new Set([...prev, ...permNames]))
      )
    } else {
      setSelectedPermissions(prev =>
        prev.filter(p => !permNames.includes(p))
      )
    }
  }

  // Agrupadores
  const groupByModulo = (perms: Permission[]) => {
    return perms.reduce((acc, perm) => {
      const parts = perm.name.split("_")
      const groupKey = parts[1] || parts[0]
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(perm)
      return acc
    }, {} as Record<string, Permission[]>)
  }

  const groupByAccion = (perms: Permission[]) => {
    return perms.reduce((acc, perm) => {
      const parts = perm.name.split("_")
      const groupKey = parts[0]
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(perm)
      return acc
    }, {} as Record<string, Permission[]>)
  }

  const groupAlfabetico = (perms: Permission[]) => {
    // Un solo grupo, ordenado alfabéticamente
    return { "TODOS": [...perms].sort((a, b) => a.name.localeCompare(b.name)) }
  }

  // Selección de agrupador según vista
  const getGroupedPermissions = () => {
    if (viewMode === "alfabetico") return groupAlfabetico(permissions)
    if (viewMode === "accion") return groupByAccion(permissions)
    return groupByModulo(permissions)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>{editingRole ? "Editar Rol" : "Agregar Rol"}</DialogTitle>
          <DialogDescription>
            {editingRole
              ? "Modifica el nombre y los permisos del rol"
              : "Completa el formulario para crear un nuevo rol"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role-name">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role-name"
              value={formData.name || ""}
              onChange={e => {
                // Convierte a mayúsculas y reemplaza espacios por guiones bajos
                let value = e.target.value.toUpperCase().replace(/ /g, "_")
                // Elimina caracteres no permitidos (solo letras, números y guion bajo)
                value = value.replace(/[^A-Z0-9_]/g, "")
                setFormData({ ...formData, name: value })
              }}
              pattern="^[A-Z0-9_]+$"
              title="Solo mayúsculas, números y guiones bajos. No se permiten espacios."
              required
            />
          </div>
          <div>
            <Label>Permisos</Label>
            <Input
              placeholder="Buscar permiso..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-2"
            />
            <div className="mb-2 flex flex-wrap items-center gap-2 justify-end">
              <span className="text-xs text-gray-500 mr-auto">Vista:</span>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "modulo" ? "default" : "outline"}
                onClick={() => setViewMode("modulo")}
                className="px-3 py-1"
              >
                Por módulo
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "accion" ? "default" : "outline"}
                onClick={() => setViewMode("accion")}
                className="px-3 py-1"
              >
                Por acción
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {Object.entries(
                viewMode === "accion"
                  ? groupByAccion(permissions)
                  : groupByModulo(permissions)
              ).map(([group, perms]) => {
                const filtered = filterPermissions(perms)
                if (filtered.length === 0) return null
                const allSelected = isAllGroupSelected(filtered)
                const someSelected = isSomeGroupSelected(filtered)
                return (
                  <div key={group} className="mb-2 border-b pb-2 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{group}</span>
                      <label className="flex items-center gap-2 text-xs select-none">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={el => {
                            if (el) el.indeterminate = !allSelected && someSelected
                          }}
                          onChange={e => handleSelectAllGroup(group, filtered, e.target.checked)}
                        />
                        Todos
                      </label>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      {filtered.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.name)}
                            onChange={() => handlePermissionChange(perm.name)}
                          />
                          {perm.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
              {permissions.length === 0 && (
                <span className="text-xs text-gray-400">No hay permisos disponibles</span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
          >
            {editingRole ? "Actualizar Rol" : "Crear Rol"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RoleFormDialog