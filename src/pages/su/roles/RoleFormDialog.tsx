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
  }

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, selectedPermissions)
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
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {permissions.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.name)}
                    onChange={() => handlePermissionChange(perm.name)}
                  />
                  {perm.name}
                </label>
              ))}
              {permissions.length === 0 && (
                <span className="text-xs text-gray-400 col-span-2">No hay permisos disponibles</span>
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