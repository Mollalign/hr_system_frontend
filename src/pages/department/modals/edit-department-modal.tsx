import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Department } from "@/types/department";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for department validation
const departmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters long"),
  manager_id: z.string(),
  is_active: z.boolean()
});


interface EditDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onUpdate: (updatedDepartment: { id: string; name: string; manager_id: string | null; is_active: boolean }) => void;
  isLoading?: boolean;
}

export default function EditDepartmentModal({ open, onOpenChange, department, onUpdate, isLoading = false }: EditDepartmentModalProps) {
  const [formData, setFormData] = useState<{ id: string; name: string; manager_id: string; is_active: boolean }>({ 
    id: '',
    name: '', 
    manager_id: 'none', 
    is_active: true 
  });
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (department) {
      setFormData({
        id: department.id,
        name: department.name,
        manager_id: 'none', // We'll need to get manager_id from manager_name if needed
        is_active: department.is_active
      });
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    try {
      // Validate form data using Zod schema
      const validatedData = departmentSchema.parse(formData);
      
      await onUpdate({
        id: department!.id,
        name: validatedData.name,
        manager_id: validatedData.manager_id === "none" || validatedData.manager_id === "" ? null : validatedData.manager_id,
        is_active: validatedData.is_active
      });
      toast.success('Department updated successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.issues[0].message);
      } else {
        setValidationError('Failed to update department. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({ id: '', name: '', manager_id: 'none', is_active: true });
    setValidationError('');
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Edit the details of the department. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {validationError && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 mb-4">
            <p className="text-destructive text-sm">{validationError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Department Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={formData.manager_id}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, manager_id: value }))}
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
              <Label htmlFor="is_active">Status</Label>
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
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
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
      </DialogContent>
    </Dialog>
  );
}