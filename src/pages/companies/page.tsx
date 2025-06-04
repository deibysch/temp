"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Company } from "@/types/company"
import { Plus, Search, Building2 } from "lucide-react"
import { CompanyList } from "./components/company-list"
import { CompanyForm } from "./components/company-form"
import { CompanyFilters } from "./components/company-filters"

export default function CompaniesPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  
  const handleCreateSuccess = (company: Company) => {
    setIsCreating(false)
    toast({
      title: "Empresa creada",
      description: `${company.name} ha sido creada exitosamente.`,
      variant: "success",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Gestión de Empresas
        </h1>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      <div className="grid md:grid-cols-[250px,1fr] gap-6">
        <Card className="h-fit">
          <CardContent className="p-4">
            <CompanyFilters />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar empresas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <CompanyList searchQuery={searchQuery} />
        </div>
      </div>

      <CompanyForm
        open={isCreating}
        onOpenChange={setIsCreating}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
