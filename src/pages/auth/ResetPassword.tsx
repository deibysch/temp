"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { resetPassword } from "./authApi"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [token] = useState(searchParams.get("token") || "")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      })
      setIsSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-start">
          <Link to="/login" className="text-gray-500 hover:text-gray-700 mt-2">
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
            <h1 className="text-2xl font-bold">Restablecer Contraseña</h1>
          </div>
          <div className="w-5"></div>
        </div>

        <p className="text-center text-muted-foreground">Ingresa tu nueva contraseña para tu cuenta.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || isSuccess}
              className="h-12"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Nueva contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting || isSuccess}
              className="h-12"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
              Confirmar nueva contraseña
            </label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              disabled={isSubmitting || isSuccess}
              className="h-12"
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            className="w-full h-12 bg-green-500 hover:bg-green-600"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting
              ? "Restableciendo..."
              : isSuccess
              ? "Contraseña restablecida"
              : "Restablecer Contraseña"}
          </Button>
        </form>

        {isSuccess && (
          <div className="text-center mt-4 text-green-600">
            Contraseña restablecida correctamente. <Link to="/login" className="font-medium underline">Iniciar sesión</Link>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            ¿Recordaste tu contraseña?{" "}
            <Link to="/login" className="text-green-500 hover:text-green-600 font-medium">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
