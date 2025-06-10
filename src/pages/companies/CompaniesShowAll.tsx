"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Company } from "@/types/companies"
import { toast } from "@/components/ui/use-toast"
import MenuSidebar from "@/layouts/Menu"
import * as companiesApi from "./companiesApi"
import CompanyFormDialog from "./CompanyFormDialog"
import CompanyDeleteDialog from "./CompanyDeleteDialog"
import Header from "@/layouts/Header"

export default function Page() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<Partial<Company>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("companies")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)

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
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    const data = await companiesApi.getCompanies()
    setCompanies(data)
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

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return
    try {
      await companiesApi.deleteCompany(companyToDelete.id)
      fetchCompanies()
    } catch (error) {
    } finally {
      setDeleteDialogOpen(false)
      setCompanyToDelete(null)
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
        <Header
          title="Empresas"
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm"
                  autoComplete="off"
                />
              </div>
              <CompanyFormDialog
                open={isDialogOpen}
                setOpen={setIsDialogOpen}
                editingCompany={editingCompany}
                setEditingCompany={setEditingCompany}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                openAddDialog={openAddDialog}
              />
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block border-0 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Logo</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Nombre</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Dirección</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Descripción</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCompanies.map((company) => (
                      <TableRow key={company.id} className="border-b hover:bg-green-50 dark:hover:bg-emerald-900/70 transition-colors">
                        <TableCell>
                          {company.photo_url && (
                            <img
                              src={company.photo_url || "/placeholder.svg"}
                              alt={company.name}
                              className="h-8 w-8 object-contain rounded"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.address}</TableCell>
                        <TableCell>{company.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(company)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(company)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
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
                <Card
                  key={company.id}
                  className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {company.photo_url && (
                          <img
                            src={company.photo_url || "/placeholder.svg"}
                            alt={company.name}
                            className="h-8 w-8 object-contain rounded"
                          />
                        )}
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{company.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <p>Dirección: {company.address}</p>
                      <p>{company.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(company)}
                        className="flex-1 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(company)}
                        className="flex-1 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
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
            <CompanyDeleteDialog
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              company={companyToDelete}
              onConfirm={handleConfirmDelete}
            />
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
