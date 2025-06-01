"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, Wallet, CreditCard, TrendingUp, Bell, Settings, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Dashboard() {
  const [userName] = useState("Juan")
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative h-10 w-auto">
              <img
                src="/images/ahorraya-logo-horizontal.png"
                alt="AhorraYa Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">¡Bienvenido, {userName}!</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tus finanzas</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white">
          <CardContent className="pt-6">
            <div className="text-sm opacity-80">Balance Total</div>
            <div className="text-3xl font-bold mt-1">$2,450.00</div>
            <div className="flex justify-between mt-4">
              <div>
                <div className="text-sm opacity-80">Ingresos</div>
                <div className="font-semibold">+$3,500.00</div>
              </div>
              <div>
                <div className="text-sm opacity-80">Gastos</div>
                <div className="font-semibold">-$1,050.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
            <Wallet className="h-6 w-6 text-green-500" />
            <span>Transferir</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
            <CreditCard className="h-6 w-6 text-green-500" />
            <span>Pagar</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
            <PiggyBank className="h-6 w-6 text-green-500" />
            <span>Ahorrar</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <span>Invertir</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Supermercado", amount: "-$85.50", date: "Hoy" },
                { name: "Depósito", amount: "+$1,200.00", date: "Ayer" },
                { name: "Restaurante", amount: "-$32.40", date: "24 Mayo" },
                { name: "Salario", amount: "+$2,300.00", date: "22 Mayo" },
              ].map((transaction, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  </div>
                  <div className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Metas de Ahorro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Vacaciones", current: 1200, target: 2500, percentage: 48 },
                { name: "Nuevo Teléfono", current: 350, target: 800, percentage: 44 },
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="font-medium">{goal.name}</div>
                    <div className="text-sm">
                      ${goal.current} / ${goal.target}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${goal.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-card border-t py-2 sticky bottom-0">
        <div className="container mx-auto">
          <div className="flex justify-around">
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <Wallet className="h-5 w-5" />
              <span className="text-xs mt-1">Inicio</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs mt-1">Estadísticas</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <PiggyBank className="h-5 w-5" />
              <span className="text-xs mt-1">Ahorros</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <Settings className="h-5 w-5" />
              <span className="text-xs mt-1">Perfil</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
