"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import type { Company } from "@/types/company"
import { toast } from "@/components/ui/use-toast"
import MenuSidebar from "@/layouts/MenuSU"
import * as companiesApi from "./companiesApi"
import CompanyFormDialog from "./CompanyFormDialog"
import CompanyDeleteDialog from "./CompanyDeleteDialog"
import Header from "@/layouts/Header"
import * as categoriesApi from "../categories/categoriesApi"
import type { Category } from "@/types/category"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import PanelCRUD, { PanelCRUDColumn, PanelCRUDAction } from "@/components/PanelCRUD"

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
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const itemsPerPage = 6

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
  }, [companies, searchTerm])

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCompanies, currentPage])

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getCategories()
      setCategories(data)
    } catch (error) {
      
    }
  }

  const fetchCompanies = async () => {
    // Si selectedCategory es "all", no filtrar por categoría
    const data = await companiesApi.getCompanies(selectedCategory !== "all" ? Number(selectedCategory) : undefined)
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

  // Helper para obtener el nombre de la categoría por id
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "-"
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.name : "-"
  }

  // Column definitions for PanelCRUD
  const columns: PanelCRUDColumn<Company>[] = [
    {
      key: "photo_url",
      label: "Logo",
      render: (company) => company.photo_url ? (
        <img src={company.photo_url || "/placeholder.svg"} alt={company.name} className="h-8 w-8 object-contain rounded" />
      ) : null,
    },
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripción" },
    {
      key: "category_id",
      label: "Categoría",
      render: (company) => getCategoryName(company.category_id),
    },
  ]

  const actions: PanelCRUDAction<Company>[] = [
    {
      label: "Editar",
      onClick: handleEdit,
      icon: <Edit className="h-4 w-4" />,
      className: "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
    {
      label: "Eliminar",
      onClick: handleDeleteClick,
      icon: <Trash2 className="h-4 w-4" />,
      className: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
  ]

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
        <Header title="Empresas" onSidebarOpen={() => setSidebarOpen(true)} />
        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <PanelCRUD
            title="Empresas"
            data={paginatedCompanies}
            columns={columns}
            actions={actions}
            loading={false}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showSearch={true}
            showAddButton={true}
            onAdd={openAddDialog}
            addButtonLabel="Nueva Empresa"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            renderMobileCard={(company) => (
              <Card key={company.id} className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {company.photo_url && (
                        <img src={company.photo_url || "/placeholder.svg"} alt={company.name} className="h-8 w-8 object-contain rounded" />
                      )}
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{company.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <p>{company.description}</p>
                    <p>Categoría: {getCategoryName(company.category_id)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(company)} className="flex-1 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <Edit className="h-4 w-4 mr-1" />Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteClick(company)} className="flex-1 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4 mr-1" />Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            noResultsText="No hay empresas"
          >
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={value => setSelectedCategory(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PanelCRUD>
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
          <CompanyDeleteDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            company={companyToDelete}
            onConfirm={handleConfirmDelete}
          />
        </main>
      </div>
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
