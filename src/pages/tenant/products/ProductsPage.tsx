"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import type { Product } from "@/types/product"
import { toast } from "@/components/ui/use-toast"
import MenuSidebar from "@/layouts/MenuBusiness"
import * as productsApi from "./productsApi"
import ProductFormDialog from "./ProductFormDialog"
import ProductDeleteDialog from "./ProductDeleteDialog"
import Header from "@/layouts/Header"
import PanelCRUD, { PanelCRUDColumn, PanelCRUDAction } from "@/components/PanelCRUD"

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("products")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const itemsPerPage = 6

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
  }, [products, searchTerm])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchProducts = async () => {
    const data = await productsApi.getProducts() as Product[]
    setProducts(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productsApi.updateProduct(editingProduct.id, formData)
        toast({ title: "Actualizado", description: "Producto actualizado correctamente" })
      } else {
        await productsApi.createProduct(formData as Omit<Product, "id">)
        toast({ title: "Creado", description: "Producto creado correctamente" })
      }
      setIsDialogOpen(false)
      setEditingProduct(null)
      setFormData({})
      fetchProducts()
    } catch (error) {
      // El toast de error ya lo muestra http.ts
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    try {
      await productsApi.deleteProduct(productToDelete.id)
      fetchProducts()
    } catch (error) {
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const openAddDialog = () => {
    setEditingProduct(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  // Column definitions for PanelCRUD
  const columns: PanelCRUDColumn<Product>[] = [
    {
      key: "url_thumbnail",
      label: "Imagen",
      render: (product) => product.url_thumbnail ? (
        <img src={product.url_thumbnail || "/placeholder.svg"} alt={product.name} className="h-8 w-8 object-contain rounded" />
      ) : null,
    },
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripción" },
  ]

  const actions: PanelCRUDAction<Product>[] = [
    {
      label: "Editar",
      onClick: handleEdit,
      icon: <Edit className="h-4 w-4" />, // Se muestra solo en mobile
      className: "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
    {
      label: "Eliminar",
      onClick: handleDeleteClick,
      icon: <Trash2 className="h-4 w-4" />, // Se muestra solo en mobile
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
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Productos" onSidebarOpen={() => setSidebarOpen(true)} />
        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <PanelCRUD
            title="Productos"
            data={paginatedProducts}
            columns={columns}
            actions={actions}
            loading={false}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showSearch={true}
            showAddButton={true}
            onAdd={openAddDialog}
            addButtonLabel="Nuevo Producto"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            renderMobileCard={(product) => (
              <Card key={product.id} className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {product.url_thumbnail && (
                        <img src={product.url_thumbnail || "/placeholder.svg"} alt={product.name} className="h-8 w-8 object-contain rounded" />
                      )}
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <p>{product.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex-1 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <Edit className="h-4 w-4 mr-1" />Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteClick(product)} className="flex-1 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4 mr-1" />Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            noResultsText="No hay productos"
          >
            {/* Puedes agregar filtros adicionales aquí si lo necesitas */}
          </PanelCRUD>
          <ProductFormDialog
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            product={editingProduct}
            setProduct={setEditingProduct}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            openAddDialog={openAddDialog}
          />
          <ProductDeleteDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            product={productToDelete}
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
