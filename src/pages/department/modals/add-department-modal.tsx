import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { createDepartment } from "@/types/department";
import { Loader2 } from "lucide-react";
import { z} from "zod";

// Zod schema for department validation
const departmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters long"),
  manager_id: z.string(),
  is_active: z.boolean()
});

interface AddDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (newDepartment: createDepartment) => void;
  loading: boolean;
}

function AddDepartmentModal({ open, onOpenChange, onAdd, loading }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState<{ name: string; manager_id: string; is_active: boolean }>({ 
    name: '', 
    manager_id: 'none', 
    is_active: true 
  });

  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    try {
      // Validate form data using Zod schema
      const validatedData = departmentSchema.parse(formData);
      
      console.log('Submitting department:', validatedData);
      // Send null if manager_id is "none" or empty
      const submitData = {
        name: validatedData.name,
        manager_id: validatedData.manager_id === "none" || validatedData.manager_id === "" ? null : validatedData.manager_id,
        is_active: validatedData.is_active
      };
      await onAdd(submitData);
      setFormData({ name: '', manager_id: 'none', is_active: true });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.issues[0].message);
      } else {
        setValidationError('An unexpected error occurred');
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({ name: '', manager_id: 'none', is_active: true });
    setValidationError('');
  };

  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            Add a new department to the system. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {validationError && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 mb-4">
              <p className="text-destructive text-sm">{validationError}</p>
            </div>
          )}
          <div className="grid gap-4 py-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter department name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={formData.manager_id}
                // onValueChange={(value: string) => setFormData(prev => ({ ...prev, manager_id: value }))}
              >
                <SelectTrigger className="w-full !h-12">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Manager</SelectItem>
                  <SelectItem value="6c6606bb-a888-49f0-bf5b-5e7da1d8a774">John Doe</SelectItem>
                  <SelectItem value="289aed22-6e09-4ae0-94d8-2ca96752c10a">Jane Smith</SelectItem>
                  <SelectItem value="37321f18-2a2d-426d-9195-0a3f3cc79868">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.is_active ? 'true' : 'false'} 
                onValueChange={(value: 'true' | 'false') => 
                  setFormData(prev => ({ ...prev, is_active: value === 'true' }))
                }
              >
                <SelectTrigger className="w-full !h-12">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
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
      </DialogContent>
    </Dialog>
  )
}

export default AddDepartmentModal