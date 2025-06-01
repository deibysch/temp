"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    birthDate: "",
    phone: "",
    gender: "",
    email: "",
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En un caso real, aquí iría la lógica de registro
    navigate("/dashboard")
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
            <label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <Input
              id="fullName"
              placeholder="Nombre y apellido"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="idNumber" className="text-sm font-medium text-foreground">
              Cédula de identidad
            </label>
            <Input
              id="idNumber"
              placeholder="Ej: 12345678"
              value={formData.idNumber}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium text-foreground">
              Fecha de nacimiento
            </label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Teléfono
            </label>
            <Input
              id="phone"
              placeholder="Ej: 09XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium text-foreground">
              Sexo
            </label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona tu sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Femenino</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
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
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-green-500 hover:bg-green-600 mt-4">
            Crear Cuenta
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
