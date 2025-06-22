import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export interface PanelCRUDColumn<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface PanelCRUDAction<T> {
  label: string
  onClick: (row: T) => void
  color?: string
  icon?: React.ReactNode
  className?: string
}

interface PanelCRUDProps<T> {
  title?: string
  data: T[]
  columns: PanelCRUDColumn<T>[]
  actions?: PanelCRUDAction<T>[]
  loading?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
  showAddButton?: boolean
  onAdd?: () => void
  addButtonLabel?: string
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  itemsPerPage?: number
  renderMobileCard?: (row: T) => React.ReactNode
  noResultsText?: string
  className?: string
  children?: React.ReactNode
}

function PanelCRUD<T extends { id: number | string }>(props: PanelCRUDProps<T>) {
  const {
    title,
    data,
    columns,
    actions = [],
    loading = false,
    searchValue = "",
    onSearchChange,
    showSearch = true,
    showAddButton = true,
    onAdd,
    addButtonLabel = "Agregar",
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    itemsPerPage = 10,
    renderMobileCard,
    noResultsText = "Sin resultados",
    className,
    children,
  } = props

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header: Search & Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full max-w-2xl">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchValue}
                onChange={e => onSearchChange?.(e.target.value)}
                className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm w-full"
                autoComplete="off"
                disabled={loading}
              />
            </div>
          )}
          {children}
        </div>
        {showAddButton && onAdd && (
          <div className="flex gap-2">
            <Button
              onClick={onAdd}
              className="bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
              disabled={loading}
            >
              + {addButtonLabel}
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block border-0 shadow-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                {columns.map(col => (
                  <TableHead key={col.key as string} className={col.className || "font-medium text-green-600 dark:text-green-400"}>{col.label}</TableHead>
                ))}
                {actions.length > 0 && <TableHead className="font-medium text-green-600 dark:text-green-400">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                    <span className="text-muted-foreground">Cargando...</span>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                    <span className="text-muted-foreground">{noResultsText}</span>
                  </TableCell>
                </TableRow>
              ) : (
                data.map(row => (
                  <TableRow key={row.id} className="border-b hover:bg-green-50 dark:hover:bg-emerald-900/70 transition-colors">
                    {columns.map(col => (
                      <TableCell key={col.key as string} className={col.className}>
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <div className="flex gap-1">
                          {actions.map((action, idx) => (
                            <Button
                              key={action.label + idx}
                              size="sm"
                              variant="ghost"
                              onClick={() => action.onClick(row)}
                              className={action.className}
                            >
                              {action.icon}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center text-muted-foreground">Cargando...</CardContent>
          </Card>
        ) : data.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center text-muted-foreground">{noResultsText}</CardContent>
          </Card>
        ) : (
          data.map(row => (
            renderMobileCard ? (
              <React.Fragment key={row.id}>{renderMobileCard(row)}</React.Fragment>
            ) : (
              <Card key={row.id} className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {columns.map(col => (
                    <div key={col.key as string} className="mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{col.label}: </span>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </div>
                  ))}
                  {actions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {actions.map((action, idx) => (
                        <Button
                          key={action.label + idx}
                          size="sm"
                          variant="outline"
                          onClick={() => action.onClick(row)}
                          className={action.className}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            Visualizando registros {(currentPage - 1) * itemsPerPage + 1}
            –
            {Math.min(currentPage * itemsPerPage, data.length)}
            {" de "}
            {data.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default PanelCRUD
