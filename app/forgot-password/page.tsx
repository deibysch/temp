"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Simulamos el envío de instrucciones
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center">
          <Link href="/login" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 text-center">
            <div className="relative h-24 w-24 mx-auto mb-2">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Image
                  src="/images/ahorraya-logo.png"
                  alt="AhorraYa Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
          </div>
          <div className="w-5"></div> {/* Spacer para equilibrar el diseño */}
        </div>

        <p className="text-center text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>

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
              disabled={isSending || isSent}
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-green-500 hover:bg-green-600" disabled={isSending || isSent}>
            {isSending ? "Enviando..." : isSent ? "Instrucciones Enviadas" : "Enviar Instrucciones"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            ¿Recordaste tu contraseña?{" "}
            <Link href="/login" className="text-green-500 hover:text-green-600 font-medium">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
