import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { AllowanceType } from "@/types/allowance";
import type { Allowance, UpdateAllowanceRequest } from "@/types/allowance";
import { toast } from "sonner";

interface EditAllowanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowance: Allowance | null;
  onUpdate: (updatedAllowance: UpdateAllowanceRequest) => void;
  isLoading?: boolean;
}

export function EditAllowanceModal({
  open,
  onOpenChange,
  allowance,
  onUpdate,
  isLoading = false,
}: EditAllowanceModalProps) {
  const [formData, setFormData] = useState<UpdateAllowanceRequest>({
    id: "",
    name: "",
    description: "",
    type: AllowanceType.PERCENTAGE,
    percentage: 0,
    amount: 0,
    is_active: true,
  });
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (allowance) {
      setFormData({ ...allowance });
    }
  }, [allowance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.name.trim()) {
      setValidationError("Allowance name is required");
      return;
    }
    if (formData.percentage < 0) {
      setValidationError("Percentage must be positive");
      return;
    }
    if (formData.amount < 0) {
      setValidationError("Amount must be positive");
      return;
    }

    try {
      await onUpdate({ ...formData });
      toast.success("Allowance updated successfully");
    } catch (error) {
      setValidationError("Failed to update allowance. Please try again.");
      console.error("Error: ", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      type: AllowanceType.PERCENTAGE,
      percentage: 0,
      amount: 0,
      is_active: true,
    });
    setValidationError("");
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto rounded-xl p-6 sm:p-8 shadow-lg bg-white dark:bg-gray-900 transition-all">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Edit Allowance
          </DialogTitle>
          <DialogDescription className="mt-1 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Update the allowance details. Click save when you’re done.
          </DialogDescription>
        </DialogHeader>

        {validationError && (
          <div className="rounded-lg border border-red-400 bg-red-50 dark:bg-red-900/20 p-3 my-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-6 mt-4">
          {/* Name */}
          <div className="grid gap-1">
            <Label htmlFor="name">Allowance Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter allowance name"
              required
              className="rounded-lg h-12"
            />
          </div>

          {/* Type */}
          <div className="grid gap-1">
            <Label htmlFor="type">Allowance Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "percentage" | "fixed") =>
                setFormData((prev) => ({ ...prev, type: value as AllowanceType }))
              }
            >
              <SelectTrigger className="w-full h-12 rounded-lg">
                <SelectValue placeholder="Select allowance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Percentage */}
          <div className="grid gap-1">
            <Label htmlFor="percentage">Allowance Percentage</Label>
            <Input
              id="percentage"
              type="number"
              value={formData.percentage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, percentage: Number(e.target.value) }))
              }
              placeholder="Enter percentage"
              className="rounded-lg h-12"
              required
            />
          </div>

          {/* Amount */}
          <div className="grid gap-1">
            <Label htmlFor="amount">Allowance Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
              placeholder="Enter amount"
              className="rounded-lg h-12"
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <Label htmlFor="description">Allowance Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter description"
              className="rounded-lg h-12"
            />
          </div>

          {/* Status */}
          <div className="grid gap-1">
            <Label htmlFor="is_active">Allowance Status</Label>
            <Select
              value={formData.is_active ? "true" : "false"}
              onValueChange={(value: "true" | "false") =>
                setFormData((prev) => ({ ...prev, is_active: value === "true" }))
              }
            >
              <SelectTrigger className="w-full h-12 rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
