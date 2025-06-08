"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import { register } from "./authApi"

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    name: "",
    pat_surname: "",
    mat_surname: "",
    ci: "",
    birthdate: "",
    phone_number: "",
    gender: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        name: formData.name,
        pat_surname: formData.pat_surname,
        mat_surname: formData.mat_surname,
        ci: formData.ci,
        birthdate: formData.birthdate,
        phone_number: formData.phone_number,
        gender: formData.gender,
      })
      navigate("/login")
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-start">
          <Link to="/login" className="text-muted-foreground hover:text-gray-700 mt-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 text-center">
            <div className="relative w-40 h-28 mx-auto mb-4">
              <img
                src="/images/ahorraya-logo-vertical.png"
                alt="AhorraYa Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          </div>
          <div className="w-5"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Nombres
            </label>
            <Input
              id="name"
              placeholder="Nombres"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12"
              disabled={loading}
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pat_surname" className="text-sm font-medium text-foreground">
              Apellido paterno
            </label>
            <Input
              id="pat_surname"
              placeholder="Apellido paterno"
              value={formData.pat_surname}
              onChange={handleChange}
              className="h-12"
              disabled={loading}
              autoComplete="additional-name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mat_surname" className="text-sm font-medium text-foreground">
              Apellido materno
            </label>
            <Input
              id="mat_surname"
              placeholder="Apellido materno"
              value={formData.mat_surname}
              onChange={handleChange}
              className="h-12"
              disabled={loading}
              autoComplete="family-name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ci" className="text-sm font-medium text-foreground">
              Cédula de identidad (sin extensión)
            </label>
            <Input
              id="ci"
              placeholder="Ej: 12345678"
              value={formData.ci}
              onChange={handleChange}
              required
              className="h-12"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="birthdate" className="text-sm font-medium text-foreground">
              Fecha de nacimiento
            </label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className="h-12"
              disabled={loading}
              autoComplete="bday"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-medium text-foreground">
              Teléfono
            </label>
            <Input
              id="phone_number"
              placeholder="Ej: 09XXXXXXXX"
              value={formData.phone_number}
              onChange={handleChange}
              className="h-12"
              disabled={loading}
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium text-foreground">
              Género
            </label>
            <Select onValueChange={handleSelectChange} disabled={loading} name="gender" id="gender">
              <SelectTrigger className="h-12" id="gender" name="gender" autoComplete="sex">
                <SelectValue placeholder="Selecciona tu género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="h-12"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
              Confirmar contraseña
            </label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Repite la contraseña"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength={8}
              className="h-12"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full h-12 bg-green-500 hover:bg-green-600 mt-4" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-green-500 hover:text-green-600 font-medium">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
