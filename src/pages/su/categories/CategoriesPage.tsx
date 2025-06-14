"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Category } from "@/types/categories"
import MenuSidebar from "@/layouts/Menu"
import * as categoriesApi from "./categoriesApi"
import CategoryFormDialog from "./CategoryFormDialog"
import CategoryDeleteDialog from "./CategoryDeleteDialog"
import Header from "@/layouts/Header"

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("categories")
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const itemsPerPage = 6

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        (category.description?.toLowerCase().includes(categorySearchTerm.toLowerCase()) ?? false),
    )
  }, [categories, categorySearchTerm])

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCategories, currentPage])

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [categorySearchTerm])

  const fetchCategories = async () => {
    const data = await categoriesApi.getCategories()
    setCategories(data)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, categoryFormData)
      } else {
        await categoriesApi.createCategory(categoryFormData)
      }
      setCategoryDialogOpen(false)
      setEditingCategory(null)
      setCategoryFormData({})
      fetchCategories()
    } catch (error) {

    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryFormData(category)
    setCategoryDialogOpen(true)
  }

  const handleDeleteCategoryClick = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteCategoryDialogOpen(true)
  }

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return
    try {
      await categoriesApi.deleteCategory(categoryToDelete.id)
      fetchCategories()
    } catch (error) {
    } finally {
      setDeleteCategoryDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const openAddCategoryDialog = () => {
    setEditingCategory(null)
    setCategoryFormData({})
    setCategoryDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <MenuSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        categoriesCount={categories.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          title="Categorías"
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
                  placeholder="Buscar categorías..."
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={openAddCategoryDialog} className="bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700">
                  + Nueva Categoría
                </Button>
                <CategoryFormDialog
                  open={categoryDialogOpen}
                  setOpen={setCategoryDialogOpen}
                  editingCategory={editingCategory}
                  setEditingCategory={setEditingCategory}
                  formData={categoryFormData}
                  setFormData={setCategoryFormData}
                  onSubmit={handleCategorySubmit}
                  openAddDialog={openAddCategoryDialog}
                />
              </div>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block border-0 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Logo</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Nombre</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Descripción</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCategories.map((category) => (
                      <TableRow key={category.id} className="border-b hover:bg-green-50 dark:hover:bg-emerald-900/70 transition-colors">
                        <TableCell>
                          {category.photo_url && (
                            <img
                              src={category.photo_url || "/placeholder.svg"}
                              alt={category.name}
                              className="h-8 w-8 object-contain rounded"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCategory(category)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategoryClick(category)}
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
              {paginatedCategories.map((category) => (
                <Card
                  key={category.id}
                  className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {category.photo_url && (
                          <img
                            src={category.photo_url || "/placeholder.svg"}
                            alt={category.name}
                            className="h-8 w-8 object-contain rounded"
                          />
                        )}
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <p>{category.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategoryClick(category)}
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
              <div className="flex flex-col items-center gap-1">
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
                <span className="text-xs text-muted-foreground">
                  Visualizando registros {(currentPage - 1) * itemsPerPage + 1}
                  –
                  {Math.min(currentPage * itemsPerPage, filteredCategories.length)}
                  {" de "}
                  {filteredCategories.length}
                </span>
              </div>
            )}
            <CategoryDeleteDialog
              open={deleteCategoryDialogOpen}
              setOpen={setDeleteCategoryDialogOpen}
              category={categoryToDelete}
              onConfirm={handleConfirmDeleteCategory}
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
