import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CompanyAddress } from "@/types/companyAddress";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";


interface DeleteCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyAddress | null;
  onDelete: (companyId: string) => void;
  isLoading: boolean;
}

export function DeleteCompanyModal({ 
  open, 
  onOpenChange, 
  company, 
  onDelete,
  isLoading
}: DeleteCompanyModalProps) {
  
  const handleDelete = () => {
    if (company) {
      onDelete(company.id);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Delete Company
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete this company?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {company.branch_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{company.branch_name}</p>
                <p className="text-sm text-gray-600">Phone: {company.branch_phone}</p>
                <p className="text-sm text-gray-600">Email: {company.branch_email}</p>
                <p className="text-sm text-gray-600">Address: {company.branch_address}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            This action cannot be undone. This will permanently delete the company
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
                Delete Company
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
