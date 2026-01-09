import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"

export default function LoginModal() {
  const navigate = useNavigate()

  return (
    <Dialog open onOpenChange={(open) => !open && navigate(-1)}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-xs mx-auto">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}
