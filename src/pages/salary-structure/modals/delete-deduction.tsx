import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeductionType } from "@/types/deduction";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDeductionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deduction: DeductionType | null;
  onDelete: (category: string, deductionId: string) => void;
  isLoading: boolean;
}

export function DeleteDeductionModal({ 
  open, 
  onOpenChange, 
  deduction, 
  onDelete,
  isLoading
}: DeleteDeductionModalProps) {
  const handleDelete = () => {
    if (deduction) {
      onDelete(deduction.type, deduction.id);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!deduction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Delete Deduction
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete this deduction?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {deduction.type.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type: {deduction.type}</p>
                <p className="text-sm text-gray-600">Description: {deduction.description}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            This action cannot be undone. This will permanently delete the deduction
            and remove all associated data.
          </p>
        </div>

        <DialogFooter className="gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            className="flex-1 sm:flex-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Deduction
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
