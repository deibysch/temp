"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/types/product"
import { toast } from "@/components/ui/use-toast"
import MenuSidebar from "@/layouts/MenuBusiness"
import * as productsApi from "./productsApi"
import ProductFormDialog from "./ProductFormDialog"
import ProductDeleteDialog from "./ProductDeleteDialog"
import Header from "@/layouts/Header"

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
        <Header
          title="Productos"
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm w-full"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={openAddDialog}
                  className="bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
                >
                  + Nuevo Producto
                </Button>
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
              </div>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block border-0 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Imagen</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Nombre</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Descripción</TableHead>
                      <TableHead className="font-medium text-green-600 dark:text-green-400">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id} className="border-b hover:bg-green-50 dark:hover:bg-emerald-900/70 transition-colors">
                        {/* Renderizado seguro de campos opcionales */}
                        <TableCell>
                          {product.url_thumbnail && (
                            <img
                              src={product.url_thumbnail || "/placeholder.svg"}
                              alt={product.name}
                              className="h-8 w-8 object-contain rounded"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(product)}
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
              {paginatedProducts.map((company) => (
                <Card
                  key={company.id}
                  className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {company.url_thumbnail && (
                          <img
                            src={company.url_thumbnail || "/placeholder.svg"}
                            alt={company.name}
                            className="h-8 w-8 object-contain rounded"
                          />
                        )}
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{company.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
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
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                  {" de "}
                  {filteredProducts.length}
                </span>
              </div>
            )}
            <ProductDeleteDialog
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              product={productToDelete}
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
