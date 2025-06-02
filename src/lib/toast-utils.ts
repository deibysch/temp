import { toast } from "@/hooks/use-toast"

export const showSuccessToast = (title: string, description?: string) => {
  toast({
    variant: "success",
    title,
    description,
  })
}

export const showErrorToast = (title: string, description?: string) => {
  toast({
    variant: "destructive",
    title,
    description,
  })
}

export const showInfoToast = (title: string, description?: string) => {
  toast({
    variant: "default",
    title,
    description,
  })
}
