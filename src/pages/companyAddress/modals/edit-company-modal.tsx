import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Company {
  id: string
  branch_name: string
  branch_phone: string
  branch_email: string
  branch_address: string
  is_active: boolean
}

interface EditCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
  onUpdate: (updatedCompany: Company) => void
  isLoading?: boolean
}

export function EditCompanyModal({
  open,
  onOpenChange,
  company,
  onUpdate,
  isLoading = false,
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState({
    branch_name: "",
    branch_phone: "",
    branch_email: "",
    branch_address: "",
    is_active: true,
  })
  const [validationError, setValidationError] = useState<string>("")

  useEffect(() => {
    if (company) {
      setFormData({
        branch_name: company.branch_name,
        branch_phone: company.branch_phone,
        branch_email: company.branch_email,
        branch_address: company.branch_address,
        is_active: company.is_active,
      })
    }
  }, [company])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    // Manual validations
    if (!formData.branch_name || formData.branch_name.length < 3) {
      setValidationError("Branch name must be at least 3 characters long")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.branch_email)) {
      setValidationError("Invalid email address")
      return
    }

    if (!formData.branch_address || formData.branch_address.length < 10) {
      setValidationError("Branch address must be at least 10 characters long")
      return
    }

    if (
      company &&
      formData.branch_name &&
      formData.branch_phone &&
      formData.branch_email &&
      formData.branch_address
    ) {
      onUpdate({
        ...company,
        ...formData,
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      branch_name: "",
      branch_phone: "",
      branch_email: "",
      branch_address: "",
      is_active: true,
    })
  }

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[425px] sm:rounded-2xl p-0">
        {/* Scrollable wrapper */}
        <div className="max-h-[85vh] overflow-y-auto px-4 sm:px-6 py-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Company</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Edit the details of the company. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {validationError && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-3 mb-4">
                <p className="text-destructive text-sm">{validationError}</p>
              </div>
            )}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="branch_name">Branch Name *</Label>
                <Input
                  id="branch_name"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch_name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch_phone">Branch Phone *</Label>
                <Input
                  id="branch_phone"
                  name="branch_phone"
                  value={formData.branch_phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch_phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch_email">Branch Email *</Label>
                <Input
                  id="branch_email"
                  name="branch_email"
                  type="email"
                  value={formData.branch_email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch_email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch_address">Branch Address *</Label>
                <Input
                  id="branch_address"
                  name="branch_address"
                  value={formData.branch_address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch_address: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="is_active">Status *</Label>
                <Select
                  name="is_active"
                  value={formData.is_active ? "true" : "false"}
                  onValueChange={(value: "true" | "false") =>
                    setFormData((prev) => ({ ...prev, is_active: value === "true" }))
                  }
                >
                  <SelectTrigger id="is_active" className="w-full !h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer with mobile responsiveness */}
            <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full sm:w-auto rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
