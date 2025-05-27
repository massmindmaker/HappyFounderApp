import { Toast, ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />
      ))}
    </ToastProvider>
  )
}
