"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateAllowanceRequest } from "@/types/allowance";
import { AllowanceType } from "@/types/allowance";

interface AddAllowanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (newAllowance: CreateAllowanceRequest) => Promise<void>;
  isLoading?: boolean;
}

export function AddAllowanceModal({
  open,
  onOpenChange,
  onAdd,
  isLoading = false,
}: AddAllowanceModalProps) {
  const [formData, setFormData] = useState<CreateAllowanceRequest>({
    name: "",
    type: AllowanceType.PERCENTAGE,
    percentage: 0,
    amount: 0,
    description: "",
    is_active: true,
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        type: AllowanceType.PERCENTAGE,
        percentage: 0,
        amount: 0,
        description: "",
        is_active: true,
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create allowance:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Allowance
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new allowance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Allowance Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Allowance Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Housing Allowance"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="h-12 rounded-lg"
            />
          </div>

          {/* Allowance Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Allowance Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "percentage" | "fixed") =>
                setFormData((prev) => ({
                  ...prev,
                  type: value as AllowanceType,
                }))
              }
            >
              <SelectTrigger className="w-full h-12 rounded-lg">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields */}
          {formData.type === AllowanceType.PERCENTAGE && (
            <div className="space-y-2">
              <Label htmlFor="percentage">Allowance Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                placeholder="Enter percentage (e.g., 10)"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    percentage: Number(e.target.value),
                  }))
                }
                required
                className="h-12 rounded-lg"
              />
            </div>
          )}

          {formData.type === AllowanceType.FIXED && (
            <div className="space-y-2">
              <Label htmlFor="amount">Allowance Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (e.g., 1000)"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
                required
                className="h-12 rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add extra details about this allowance..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-[80px] rounded-lg"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.is_active ? "true" : "false"}
              onValueChange={(value: "true" | "false") =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: value === "true",
                }))
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

          {/* Footer */}
          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-11 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
