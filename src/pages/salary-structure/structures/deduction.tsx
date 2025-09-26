import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useDeductions, useDeleteDeduction } from "@/hooks/useDeduction";
import { AddDeductionForm } from "../modals/add-deduction";
import { useState } from "react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TableSkeleton from "@/components/loading-ui/table-skeleton";
import type { DeductionType, DeductionTypeRequest } from "@/types/deduction";
import { EditDeductionForm } from "../modals/edit-deduction";
import { DeleteDeductionModal } from "../modals/delete-deduction";

export function DeductionTable() {
  const { data, error, isLoading } = useDeductions();
  const { mutate: deleteDeduction, isPending: isDeleting } = useDeleteDeduction();
  const [isAddDeductionModalOpen, setIsAddDeductionModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDeduction, setSelectedDeduction] = useState<DeductionTypeRequest | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDeductionToDelete, setSelectedDeductionToDelete] = useState<DeductionType | null>(null)
  // const {mutate: updateDeduction, isPending: isUpdating} = useUpdateDeduction()

  if (isLoading) return <TableSkeleton />;
  if (error) return <p>Failed to load deductions</p>;

  const handleEditDeduction = (deduction: DeductionType, categoryType: string) => {
    const deductionWithType = {
      ...deduction,
      type: categoryType.trim(), // Keep original case as stored in database
    }
    setSelectedDeduction(deductionWithType)
    setShowEditModal(true)
  }

  const handleUpdateDeduction = (updatedDeduction: DeductionTypeRequest) => {
    setSelectedDeduction(updatedDeduction)
    setShowEditModal(false)
    // The EditDeductionForm will handle the API call
  }

  const handleDeleteDeduction = (deduction: DeductionType, categoryType: string) => {
    console.log("🗑️ Delete button clicked for deduction:", deduction);
    console.log("🗑️ Category type:", categoryType);
    
    // Create a proper deduction object with the category type
    const deductionWithType = {
      ...deduction,
      type: categoryType.trim(),
    };
    
    setSelectedDeductionToDelete(deductionWithType)
    setShowDeleteModal(true)
  }
  const handleDeleteConfirmed = (category: string, deductionId: string) => {
    console.log("🗑️ Confirming delete for:", { category, deductionId });
    deleteDeduction(
      { category, id: deductionId },
      {
        onSuccess: () => {
          console.log("✅ Delete successful");
          setShowDeleteModal(false);
          setSelectedDeductionToDelete(null);
        },
        onError: (error) => {
          console.error("❌ Delete failed:", error);
        }
      }
    );
  };

  return (
    <div className="space-y-6 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Deductions</h2>
        <Button
          className="bg-primary hover:bg-primary/80 text-white"
          onClick={() => setIsAddDeductionModalOpen(true)}
        >
          {/* <Plus className="w-4 h-4" /> */}
          Add Deduction
        </Button>
      </div>
      {data?.map((category) => (
        <div key={category.id} className="border rounded-xl p-4 bg-white">
          <h2 className="text-xl font-semibold mb-2">{category.type}</h2>
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>

          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-6 py-4">Name</TableHead>
                  {/* For Tax: rename Type -> Minimum Salary */}
                  <TableHead className="px-6 py-4">
                    {category.type?.toLowerCase().trim() === "tax"
                      ? "Minimum Salary"
                      : "Type"}
                  </TableHead>

                  {/* For Tax: add Maximum Salary column */}
                  {category.type?.toLowerCase().trim() === "tax" && (
                    <TableHead className="px-6 py-4">Maximum Salary</TableHead>
                  )}

                  <TableHead className="px-6 py-4">Rate</TableHead>

                  {category.type?.toLowerCase().trim() !== "pension" && (
                    <TableHead className="px-6 py-4">Amount</TableHead>
                  )}

                  <TableHead className="px-6 py-4">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {category.data.length > 0 ? (
                  category.data.map((deduction: any) => (
                    <TableRow key={deduction.id} className="border-t">
                      <TableCell className="px-6 py-4 font-medium flex items-center gap-2">
                        {deduction.name || category.type}
                        {category.type === "Other" && deduction.description && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full hover:bg-muted"
                              >
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                              <p className="text-sm text-muted-foreground">
                                {deduction.description}
                              </p>
                            </PopoverContent>
                          </Popover>
                        )}
                      </TableCell>

                      {/* Minimum Salary / Type */}
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {category.type?.toLowerCase().trim() === "tax"
                          ? deduction.min_salary
                          : deduction.type || category.type}
                      </TableCell>

                      {/* Maximum Salary for Tax */}
                      {category.type?.toLowerCase().trim() === "tax" && (
                        <TableCell className="px-6 py-4 text-muted-foreground">
                          {deduction.max_salary ?? "-"}
                        </TableCell>
                      )}

                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {deduction.rate ?? deduction.percentage ?? "-"}
                      </TableCell>

                      {category.type?.toLowerCase().trim() !== "pension" && (
                        <TableCell className="px-4 py-2 text-muted-foreground">
                          {deduction.deduction ?? deduction.amount ?? "-"}
                        </TableCell>
                      )}

                      <TableCell className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            deduction.is_active ?? category.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              deduction.is_active ?? category.is_active
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          />
                          {deduction.is_active ?? category.is_active
                            ? "Active"
                            : "Inactive"}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                            onClick={() => handleEditDeduction(deduction, category.type)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                            onClick={() => handleDeleteDeduction(deduction, category.type)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        category.type?.toLowerCase().trim() === "tax" ? 7 : 6
                      }
                      className="text-center h-24 text-muted-foreground"
                    >
                      No deductions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      <Dialog
        open={isAddDeductionModalOpen}
        onOpenChange={setIsAddDeductionModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Deduction</DialogTitle>
          </DialogHeader>
          <AddDeductionForm onOpenChange={setIsAddDeductionModalOpen} />
        </DialogContent>
      </Dialog>

      {/* Edit Deduction Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deduction</DialogTitle>
          </DialogHeader>
          {selectedDeduction && (
            <EditDeductionForm
              onOpenChange={setShowEditModal}
              deductionData={selectedDeduction}
              onUpdate={handleUpdateDeduction}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedDeductionToDelete && (
        <DeleteDeductionModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          deduction={selectedDeductionToDelete}
          onDelete={handleDeleteConfirmed}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
