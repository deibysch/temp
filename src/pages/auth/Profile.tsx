"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  Camera,
  Save,
  ChevronLeft,
  UserIcon,
  Mail,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { updateProfile, changePassword, getProfile } from "./authApi"
import type { User, UserUpdateInput } from "@/types/user"

interface UserData {
  user: User
  roles: string[]
  permissions: string[]
}

interface PasswordChangeInput {
  current_password: string
  new_password: string
  confirm_password: string
}

export function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<UserUpdateInput>({})
  const [passwordData, setPasswordData] = useState<PasswordChangeInput>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const res = await getProfile()
      if (!res || !res.user) throw new Error("No se encontraron datos de usuario")

      const userDataFromApi: UserData = {
        user: res.user,
        roles: res.roles || [],
        permissions: res.permissions || [],
      }

      setUserData(userDataFromApi)
      setFormData({
        name: userDataFromApi.user.name,
        pat_surname: userDataFromApi.user.pat_surname,
        mat_surname: userDataFromApi.user.mat_surname,
        ci: userDataFromApi.user.ci,
        birthdate: userDataFromApi.user.birthdate,
        phone_number: userDataFromApi.user.phone_number,
        gender: userDataFromApi.user.gender,
      })
    } catch (error) {
      // No mostrar toast aquí, ya que el loading cubre el error
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar name (requerido, máximo 50 caracteres)
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "El nombre es obligatorio"
    } else if (formData.name.length > 50) {
      newErrors.name = "El nombre no debe exceder 50 caracteres"
    }

    // Validar pat_surname (opcional, máximo 50 caracteres)
    if (formData.pat_surname && formData.pat_surname.length > 50) {
      newErrors.pat_surname = "El apellido paterno no debe exceder 50 caracteres"
    }

    // Validar mat_surname (opcional, máximo 50 caracteres)
    if (formData.mat_surname && formData.mat_surname.length > 50) {
      newErrors.mat_surname = "El apellido materno no debe exceder 50 caracteres"
    }

    // Validar CI (requerido, numérico)
    if (!formData.ci) {
      newErrors.ci = "El CI es obligatorio"
    } else if (isNaN(Number(formData.ci))) {
      newErrors.ci = "El CI debe ser un número válido"
    }

    // Validar phone_number (opcional, numérico)
    if (formData.phone_number && isNaN(Number(formData.phone_number))) {
      newErrors.phone_number = "El celular debe ser un número válido"
    }

    // Validar gender (opcional, male/female)
    if (formData.gender && !["male", "female"].includes(formData.gender)) {
      newErrors.gender = "El género debe ser masculino o femenino"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    try {
      setSaving(true)
      // Aquí iría la lógica para subir la imagen
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await updateProfile({
        name: formData.name!,
        pat_surname: formData.pat_surname,
        mat_surname: formData.mat_surname,
        ci: Number(formData.ci),
        birthdate: formData.birthdate,
        phone_number: formData.phone_number ? Number(formData.phone_number) : undefined,
        gender: formData.gender as "male" | "female" | undefined,
      })
      await loadUserData()
    } catch (error: any) {
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "Las nuevas contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await changePassword(passwordData.current_password, passwordData.new_password, passwordData.confirm_password)
      toast({
        title: "Éxito",
        description: "Contraseña cambiada correctamente",
      })
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
      navigate("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      setSaving(true)
      // Aquí iría la lógica para enviar email de verificación
      toast({
        title: "Éxito",
        description: "Correo de verificación enviado correctamente",
      })
    } catch (error) {
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al panel
          </Button>
        </div>

        {/* Header Section */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-emerald-100 dark:border-emerald-900/30 shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={userData?.user.url_picture || "/placeholder.svg"} alt={userData?.user.name} />
                  <AvatarFallback className="text-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    {userData?.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all duration-200 cursor-pointer flex items-center justify-center"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={saving}
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{userData?.user.fullname}</h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    {userData?.user.email}
                    {userData?.user.email_verified_at ? (
                      <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 ml-1 text-orange-500" />
                    )}
                  </Badge>
                  {userData?.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>

                {/* Email Verification */}
                {!userData?.user.email_verified_at && (
                  <Button
                    onClick={handleVerifyEmail}
                    disabled={saving}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Verificar correo
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editable Information */}
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-emerald-600" />
                Información editable
              </CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombres *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    disabled={saving}
                    maxLength={50}
                    className={errors.name ? "border-red-500" : ""}
                    autoComplete="given-name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pat_surname">Apellido paterno</Label>
                    <Input
                      id="pat_surname"
                      name="pat_surname"
                      value={formData.pat_surname || ""}
                      onChange={handleInputChange}
                      disabled={saving}
                      maxLength={50}
                      className={errors.pat_surname ? "border-red-500" : ""}
                      autoComplete="additional-name"
                    />
                    {errors.pat_surname && <p className="text-sm text-red-500">{errors.pat_surname}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mat_surname">Apellido materno</Label>
                    <Input
                      id="mat_surname"
                      name="mat_surname"
                      value={formData.mat_surname || ""}
                      onChange={handleInputChange}
                      disabled={saving}
                      maxLength={50}
                      className={errors.mat_surname ? "border-red-500" : ""}
                      autoComplete="family-name"
                    />
                    {errors.mat_surname && <p className="text-sm text-red-500">{errors.mat_surname}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ci">CI (Documento de identidad) *</Label>
                  <Input
                    id="ci"
                    name="ci"
                    type="number"
                    value={formData.ci || ""}
                    onChange={handleInputChange}
                    disabled={saving}
                    className={errors.ci ? "border-red-500" : ""}
                    autoComplete="off"
                  />
                  {errors.ci && <p className="text-sm text-red-500">{errors.ci}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate || ""}
                    onChange={handleInputChange}
                    disabled={saving}
                    autoComplete="bday"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Celular</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number || ""}
                    onChange={handleInputChange}
                    disabled={saving}
                    className={errors.phone_number ? "border-red-500" : ""}
                    autoComplete="tel"
                  />
                  {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender || undefined}
                    onValueChange={(value: string) => setFormData((prev: UserUpdateInput) => ({ ...prev, gender: value }))}
                    disabled={saving}
                    name="gender"
                    id="gender"
                  >
                    <SelectTrigger id="gender" name="gender" aria-labelledby="gender-label">
                      <SelectValue placeholder="Selecciona género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>

                <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Read-only Information & Security */}
          <div className="space-y-6">
            {/* Read-only Information */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Información de la cuenta
                </CardTitle>
                <CardDescription>Detalles de cuenta solo lectura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-white text-sm font-medium">ID de usuario</p>
                    <p className="font-medium">{userData?.user.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-white text-sm font-medium">Estado del correo</p>
                    <p
                      className={`font-medium ${userData?.user.email_verified_at ? "text-green-600" : "text-orange-600"}`}
                    >
                      {userData?.user.email_verified_at ? "Verificado" : "No verificado"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-gray-500 dark:text-white text-sm font-medium">Roles</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData?.roles.map((role) => (
                      <Badge key={role} variant="outline" className="bg-blue-50 text-blue-700">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-white text-sm font-medium">Permisos</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData?.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="bg-gray-50 text-gray-700">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Cambiar contraseña
                </CardTitle>
                <CardDescription>Actualiza la contraseña de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Contraseña actual</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        name="current_password"
                        type={showPassword.current ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        disabled={saving}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                      >
                        {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        name="new_password"
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        disabled={saving}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      >
                        {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        name="confirm_password"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        disabled={saving}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordData.new_password && passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password && (
                      <p className="text-sm text-red-500">Las nuevas contraseñas no coinciden</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      saving ||
                      !passwordData.current_password ||
                      !passwordData.new_password ||
                      !passwordData.confirm_password
                    }
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cambiando...
                      </>
                    ) : (
                      "Cambiar contraseña"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
