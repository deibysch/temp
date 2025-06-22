"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import type { Category } from "@/types/category"
import MenuSidebar from "@/layouts/MenuSU"
import * as categoriesApi from "./categoriesApi"
import CategoryFormDialog from "./CategoryFormDialog"
import CategoryDeleteDialog from "./CategoryDeleteDialog"
import Header from "@/layouts/Header"
import PanelCRUD, { PanelCRUDColumn, PanelCRUDAction } from "@/components/PanelCRUD"

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

  const columns: PanelCRUDColumn<Category>[] = [
    {
      key: "photo_url",
      label: "Logo",
      render: (category) => category.photo_url ? (
        <img src={category.photo_url || "/placeholder.svg"} alt={category.name} className="h-8 w-8 object-contain rounded" />
      ) : null,
    },
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripción" },
  ]

  const actions: PanelCRUDAction<Category>[] = [
    {
      label: "Editar",
      onClick: handleEditCategory,
      icon: <Edit className="h-4 w-4" />,
      className: "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
    {
      label: "Eliminar",
      onClick: handleDeleteCategoryClick,
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
        categoriesCount={categories.length}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Categorías" onSidebarOpen={() => setSidebarOpen(true)} />
        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <PanelCRUD
            title="Categorías"
            data={paginatedCategories}
            columns={columns}
            actions={actions}
            loading={false}
            searchValue={categorySearchTerm}
            onSearchChange={setCategorySearchTerm}
            showSearch={true}
            showAddButton={true}
            onAdd={openAddCategoryDialog}
            addButtonLabel="Nueva Categoría"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            renderMobileCard={(category) => (
              <Card key={category.id} className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {category.photo_url && (
                        <img src={category.photo_url || "/placeholder.svg"} alt={category.name} className="h-8 w-8 object-contain rounded" />
                      )}
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <p>{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)} className="flex-1 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <Edit className="h-4 w-4 mr-1" />Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteCategoryClick(category)} className="flex-1 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4 mr-1" />Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            noResultsText="No hay categorías"
          />
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
          <CategoryDeleteDialog
            open={deleteCategoryDialogOpen}
            setOpen={setDeleteCategoryDialogOpen}
            category={categoryToDelete}
            onConfirm={handleConfirmDeleteCategory}
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
