import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Allowance } from "@/types/allowance";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteAllowanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowance: Allowance | null;
  onDelete: (allowanceId: string) => void;
  isLoading: boolean;
}

export function DeleteAllowanceModal({
  open,
  onOpenChange,
  allowance,
  onDelete,
  isLoading,
}: DeleteAllowanceModalProps) {
  const handleDelete = () => {
    if (allowance) {
      onDelete(allowance.id);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!allowance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md mx-auto rounded-xl p-6 sm:p-8 shadow-lg bg-white dark:bg-gray-900 transition-all">
        <DialogHeader className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Delete Allowance
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Are you sure you want to delete this allowance? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 space-y-4">
          {/* Allowance Summary Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {allowance.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-sm sm:text-base text-gray-700 dark:text-gray-200 space-y-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{allowance.name}</p>
                <p>Type: {allowance.type}</p>
                <p>Percentage: {allowance.percentage}</p>
                <p>Amount: {allowance.amount}</p>
                <p>Description: {allowance.description || "—"}</p>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            This will permanently delete the allowance and remove all associated data. Please confirm.
          </p>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Delete Allowance
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
