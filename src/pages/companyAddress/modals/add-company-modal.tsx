import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { z } from "zod"

// Type for request
export interface CreateCompanyAddressRequest {
  branch_name: string
  branch_phone: string
  branch_email: string
  branch_address: string
  is_active: boolean
}

// Zod schema for validation
const companySchema = z.object({
  branch_name: z.string().min(3, "Branch name must be at least 3 characters"),
  branch_phone: z.string().min(7, "Phone number must be at least 7 digits"),
  branch_email: z.string().email("Invalid email format"),
  branch_address: z.string().min(5, "Branch address must be at least 5 characters"),
  is_active: z.boolean(),
})

interface AddCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (newCompany: CreateCompanyAddressRequest) => void
  isLoading?: boolean
}

export function AddCompanyModal({
  open,
  onOpenChange,
  onAdd,
  isLoading = false,
}: AddCompanyModalProps) {
  const [formData, setFormData] = useState<CreateCompanyAddressRequest>({
    branch_name: "",
    branch_phone: "",
    branch_email: "",
    branch_address: "",
    is_active: true,
  })

  const [validationError, setValidationError] = useState<string>("")

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        branch_name: "",
        branch_phone: "",
        branch_email: "",
        branch_address: "",
        is_active: true,
      })
      setValidationError("")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    try {
      const validatedData = companySchema.parse(formData)
      onAdd(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.issues[0].message)
      } else {
        setValidationError("An unexpected error occurred")
      }
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
    setValidationError("")
  }

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[425px] sm:rounded-2xl p-0">
        {/* Scrollable container for small screens */}
        <div className="max-h-[85vh] overflow-y-auto px-4 sm:px-6 py-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add Company</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Add a new branch company to the system. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {validationError && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
                <p className="text-destructive text-sm">{validationError}</p>
              </div>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="branch_name">Branch Name *</Label>
                <Input
                  id="branch_name"
                  placeholder="Enter branch name"
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
                  placeholder="Enter branch phone"
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
                  placeholder="Enter branch email"
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
                  placeholder="Enter branch address"
                  value={formData.branch_address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch_address: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.is_active ? "true" : "false"}
                  onValueChange={(value: "true" | "false") =>
                    setFormData((prev) => ({ ...prev, is_active: value === "true" }))
                  }
                >
                  <SelectTrigger id="status" className="w-full !h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer buttons */}
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
                    Creating...
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
