import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as usersApi from "./usersApi"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import DeleteRolFromUserDialog from "./DeleteRolFromUserDialog"

type UserWithRoles = {
  id: number
  email: string
  roles_by_company: {
    [companyId: string]: string[]
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

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  editingUser: UserWithRoles | null
  setEditingUser: (user: UserWithRoles | null) => void
  allRoles: RoleOption[]
  allCompanies: CompanyOption[]
  selectedRoles: { [companyId: string]: string[] }
  setSelectedRoles: React.Dispatch<React.SetStateAction<{ [companyId: string]: string[] }>>

  onSave: () => void
  fetchUsers: () => void
}

const UserFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  editingUser,
  setEditingUser,
  allRoles,
  allCompanies,
  selectedRoles,
  setSelectedRoles,
  onSave,
  fetchUsers,
}) => {
  const [addRoleId, setAddRoleId] = useState<number | "">("")
  const [addCompanyId, setAddCompanyId] = useState<string>("global")
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ companyId: string; roleName: string } | null>(null)

  const handleClose = () => {
    setOpen(false)
    setEditingUser(null)
    setAddRoleId("")
    setAddCompanyId("global")
  }

  if (!editingUser) return null

  // Construir lista de asignaciones actuales (sin duplicados)
  const assignments: { companyId: string, companyName: string, roleName: string }[] = []
  Object.entries(selectedRoles ?? {}).forEach(([companyId, roles]) => {
    // Elimina duplicados de roles por empresa
    Array.from(new Set(roles)).forEach(roleName => {
      assignments.push({
        companyId,
        companyName:
          companyId === "global"
            ? "Global"
            : allCompanies.find(c => String(c.id) === companyId)?.name || `Empresa ${companyId}`,
        roleName,
      })
    })
  })

  // Opciones para el combobox de empresas
  const companyOptions = [{ id: "global", name: "Global" }, ...(allCompanies || []).map(c => ({ id: String(c.id), name: c.name }))]

  // Opciones para el combobox de roles (solo los que no estén ya asignados a esa empresa)
  const availableRoles = allRoles.filter(
    r =>
      !selectedRoles?.[addCompanyId]?.includes(r.name)
  )

  // Agregar nuevo rol-empresa
  const handleAddAssignment = async () => {
    if (!addRoleId || !addCompanyId) return
    const roleName = allRoles.find(r => r.id === addRoleId)?.name
    if (!roleName) return
    setLoading(true)
    try {
      await usersApi.addRoleToUser(editingUser.id, {
        role_id: addRoleId,
        company_id: addCompanyId === "global" ? null : Number(addCompanyId),
      })
      setSelectedRoles(prev => {
        const current = prev[addCompanyId] || []
        return {
          ...prev,
          [addCompanyId]: [...current, roleName],
        }
      })
      setAddRoleId("")
      setAddCompanyId("global")
      fetchUsers()
    } finally {
      setLoading(false)
    }
  }

  // Quitar asignación, solo ejecuta si se confirma el dialog
  const handleRemoveAssignment = async (companyId: string, roleName: string) => {
    const role = allRoles.find(r => r.name === roleName)
    if (!role) return
    setLoading(true)
    try {
      await usersApi.removeRoleFromUser(editingUser.id, {
        role_id: role.id,
        company_id: companyId === "global" ? null : Number(companyId),
      })
      setSelectedRoles(prev => {
        const current = prev[companyId] || []
        return {
          ...prev,
          [companyId]: current.filter(r => r !== roleName),
        }
      })
      fetchUsers()
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setPendingDelete(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>Editar roles de usuario</DialogTitle>
          <DialogDescription>
            Modifica los roles de {editingUser.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Lista responsiva de asignaciones */}
          <div>
            <div className="font-medium mb-2">Roles asignados</div>
            <div className="flex flex-col gap-2">
              {assignments.length === 0 && (
                <div className="text-muted-foreground text-center text-sm py-4 border rounded bg-muted/30">
                  No hay roles asignados.
                </div>
              )}
              {assignments.map((a, idx) => (
                <div
                  key={a.companyId + "-" + a.roleName}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border rounded px-3 py-2 bg-muted/30
                  sm:gap-2 gap-1
                  "
                >
                  <div className="flex-1 w-full">
                    <div className="font-semibold text-sm break-words">{a.roleName}</div>
                    <div className="text-xs text-muted-foreground break-words">{a.companyName}</div>
                  </div>
                  <div className="w-full sm:w-auto flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 w-full sm:w-auto"
                      onClick={() => {
                        setPendingDelete({ companyId: a.companyId, roleName: a.roleName })
                        setDeleteDialogOpen(true)
                      }}
                      disabled={loading}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Agregar nuevo rol-empresa */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-end">
            <div className="w-full sm:w-auto">
              <label className="block text-xs mb-1">Rol</label>
              <Select
                value={addRoleId === "" ? undefined : String(addRoleId)}
                onValueChange={val => setAddRoleId(val === undefined ? "" : Number(val))}
                disabled={loading}
              >
                <SelectTrigger className="w-full sm:w-40" aria-label="Selecciona un rol">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs mb-1">Empresa</label>
              <Select
                value={addCompanyId}
                onValueChange={val => setAddCompanyId(val)}
                disabled={loading}
              >
                <SelectTrigger className="w-full sm:w-40" aria-label="Selecciona una empresa">
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map(opt => (
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <Button
                onClick={handleAddAssignment}
                disabled={!addRoleId || loading}
                className="bg-green-600 text-white hover:bg-green-700 ml-0 sm:ml-2 w-full sm:w-auto"
                size="sm"
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>
        <DeleteRolFromUserDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          roleName={pendingDelete ? pendingDelete.roleName : null}
          companyName={
            pendingDelete
              ? pendingDelete.companyId === "global"
                ? "Global"
                : allCompanies.find(c => String(c.id) === pendingDelete.companyId)?.name || `Empresa ${pendingDelete.companyId}`
              : null
          }
          onConfirm={() => {
            if (pendingDelete) {
              handleRemoveAssignment(pendingDelete.companyId, pendingDelete.roleName)
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UserFormDialog