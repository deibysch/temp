"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Home,
  Package,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react"
import { Company } from "@/data/companies"
import { UserAvatar } from '@/components/profile/UserAvatar'
import { useNavigate } from 'react-router-dom'
import { userService } from '@/services/userService'
import type { User } from '@/types/user'
import { toast } from "@/components/ui/use-toast"
import MenuSidebar from "@/layouts/Menu"
import * as companiesApi from "./companiesApi"

export default function Page() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<Partial<Company>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("companies")
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  const itemsPerPage = 6

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [companies, searchTerm])

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCompanies, currentPage])

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  useEffect(() => {
    loadUserData()
    fetchCompanies()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Error loading user data:', error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    }
  }

  const fetchCompanies = async () => {
    try {
      const data = await companiesApi.getCompanies()
      setCompanies(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCompany) {
        await companiesApi.updateCompany(editingCompany.id, formData)
        toast({ title: "Actualizado", description: "Empresa actualizada correctamente" })
      } else {
        await companiesApi.createCompany(formData)
        toast({ title: "Creado", description: "Empresa creada correctamente" })
      }
      setIsDialogOpen(false)
      setEditingCompany(null)
      setFormData({})
      fetchCompanies()
    } catch (error) {
      // El toast de error ya lo muestra http.ts
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData(company)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await companiesApi.deleteCompany(id)
      toast({ title: "Eliminado", description: "Empresa eliminada correctamente" })
      fetchCompanies()
    } catch (error) {
      // El toast de error ya lo muestra http.ts
    }
  }

  const openAddDialog = () => {
    setEditingCompany(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <MenuSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        companiesCount={companies.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {companies.length} Empresas
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <UserAvatar 
                user={user || {
                  name: "Loading...",
                  email: "loading@example.com",
                  avatar_url: "/images/avatar-placeholder.png",
                  role: "user"
                }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddDialog}
                    className="bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Empresa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingCompany ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="photo_url">Logo (URL)</Label>
                      <Input
                        id="photo_url"
                        value={formData.photo_url || ""}
                        onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitud</Label>
                      <Input
                        id="latitude"
                        value={formData.latitude || ""}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        value={formData.longitude || ""}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingCompany ? "Actualizar" : "Crear"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block border-0 shadow-none">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-medium">Logo</TableHead>
                      <TableHead className="font-medium">Nombre</TableHead>
                      <TableHead className="font-medium">Dirección</TableHead>
                      <TableHead className="font-medium">Descripción</TableHead>
                      <TableHead className="font-medium">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCompanies.map((company) => (
                      <TableRow key={company.id} className="border-b">
                        <TableCell>
                          {company.photo_url && (
                            <img src={company.photo_url} alt={company.name} className="h-8 w-8 object-contain rounded" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.address}</TableCell>
                        <TableCell>{company.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(company)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(company.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paginatedCompanies.map((company) => (
                <Card key={company.id} className="border-0 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {company.photo_url && (
                          <img src={company.photo_url} alt={company.name} className="h-8 w-8 object-contain rounded" />
                        )}
                        <h3 className="font-medium">{company.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <p>Dirección: {company.address}</p>
                      <p>{company.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(company)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(company.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
