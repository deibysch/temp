"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

function ProgressBar({
  variant,
  duration = 5000,
}: { variant?: "default" | "destructive" | "success"; duration?: number }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 50)
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  const getProgressBarColor = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-500 dark:bg-red-400"
      case "success":
        return "bg-green-600 dark:bg-green-600"
      default:
        return "bg-blue-500 dark:bg-blue-400"
    }
  }

  const getBackgroundColor = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-200 dark:bg-red-900/30"
      case "success":
        return "bg-green-200 dark:bg-green-900/30"
      default:
        return "bg-gray-200 dark:bg-gray-700/50"
    }
  }

  return (
    <div className={`absolute bottom-0 left-0 right-0 h-1 ${getBackgroundColor()}`}>
      <div
        className={`h-full transition-all duration-75 ease-linear ${getProgressBarColor()}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
          <ProgressBar variant={variant} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
