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
import { Edit, Trash2, Info } from "lucide-react";
import { useDeductions, useDeleteDeduction } from "@/hooks/useDeduction";
import { AddDeductionForm } from "../modals/add-deduction";
import { useState } from "react";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<DeductionTypeRequest | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeductionToDelete, setSelectedDeductionToDelete] = useState<DeductionType | null>(null);

  if (isLoading) return <TableSkeleton />;
  if (error) return <p className="text-red-500 text-sm">Failed to load deductions</p>;

  const handleEditDeduction = (deduction: DeductionType, categoryType: string) => {
    setSelectedDeduction({ ...deduction, type: categoryType.trim() });
    setShowEditModal(true);
  };

  const handleDeleteDeduction = (deduction: DeductionType, categoryType: string) => {
    setSelectedDeductionToDelete({ ...deduction, type: categoryType.trim() });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = (category: string, deductionId: string) => {
    deleteDeduction(
      { category, id: deductionId },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedDeductionToDelete(null);
        },
      }
    );
  };

  return (
    <div className="space-y-8 mb-10 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl md:text-2xl font-semibold">💸 Deductions</h2>
        <Button
          className="bg-primary hover:bg-primary/80 text-white rounded-xl shadow-md"
          onClick={() => setIsAddDeductionModalOpen(true)}
        >
          Add Deduction
        </Button>
      </div>

      {/* Categories */}
      {data?.map((category) => (
        <div
          key={category.id}
          className="border rounded-2xl p-4 md:p-6 bg-white shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg md:text-xl font-semibold mb-1">{category.type}</h3>
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto rounded-xl border">
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="px-6 py-3">Name</TableHead>
                  <TableHead className="px-6 py-3">
                    {category.type?.toLowerCase().trim() === "tax" ? "Minimum Salary" : "Type"}
                  </TableHead>
                  {category.type?.toLowerCase().trim() === "tax" && (
                    <TableHead className="px-6 py-3">Maximum Salary</TableHead>
                  )}
                  <TableHead className="px-6 py-3">Rate</TableHead>
                  {category.type?.toLowerCase().trim() !== "pension" && (
                    <TableHead className="px-6 py-3">Amount</TableHead>
                  )}
                  <TableHead className="px-6 py-3">Status</TableHead>
                  <TableHead className="px-6 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {category.data.length > 0 ? (
                  category.data.map((deduction: any) => (
                    <TableRow key={deduction.id} className="hover:bg-muted/30">
                      <TableCell className="px-6 py-3 font-medium flex items-center gap-2">
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
                            <PopoverContent className="w-64 text-sm">
                              {deduction.description}
                            </PopoverContent>
                          </Popover>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-muted-foreground">
                        {category.type?.toLowerCase().trim() === "tax"
                          ? deduction.min_salary
                          : deduction.type || category.type}
                      </TableCell>
                      {category.type?.toLowerCase().trim() === "tax" && (
                        <TableCell className="px-6 py-3 text-muted-foreground">
                          {deduction.max_salary ?? "-"}
                        </TableCell>
                      )}
                      <TableCell className="px-6 py-3 text-muted-foreground">
                        {deduction.rate ?? deduction.percentage ?? "-"}
                      </TableCell>
                      {category.type?.toLowerCase().trim() !== "pension" && (
                        <TableCell className="px-6 py-3 text-muted-foreground">
                          {deduction.deduction ?? deduction.amount ?? "-"}
                        </TableCell>
                      )}
                      <TableCell className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            deduction.is_active ?? category.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              deduction.is_active ?? category.is_active
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {deduction.is_active ?? category.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-muted"
                            onClick={() => handleEditDeduction(deduction, category.type)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-muted"
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
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No deductions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
              {category.data.length > 0 ? (
                category.data.map((deduction: any) => (
                  <div
                    key={deduction.id}
                    className="p-4 border rounded-xl shadow-sm bg-gray-50 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{deduction.name || category.type}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditDeduction(deduction, category.type)}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteDeduction(deduction, category.type)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.type?.toLowerCase().trim() === "tax"
                        ? `Salary: ${deduction.min_salary} - ${deduction.max_salary ?? "-"}`
                        : deduction.type || category.type}
                    </p>
                    <p className="text-sm text-gray-600">Rate: {deduction.rate ?? deduction.percentage ?? "-"}</p>
                    {category.type?.toLowerCase().trim() !== "pension" && (
                      <p className="text-sm text-gray-600">
                        Amount: {deduction.deduction ?? deduction.amount ?? "-"}
                      </p>
                    )}
                    <span
                      className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium self-start ${
                        deduction.is_active ?? category.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          deduction.is_active ?? category.is_active
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {deduction.is_active ?? category.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No deductions found.</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Modals */}
      <Dialog open={isAddDeductionModalOpen} onOpenChange={setIsAddDeductionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Deduction</DialogTitle>
          </DialogHeader>
          <AddDeductionForm onOpenChange={setIsAddDeductionModalOpen} />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Deduction</DialogTitle>
          </DialogHeader>
          {selectedDeduction && (
            <EditDeductionForm
              onOpenChange={setShowEditModal}
              deductionData={selectedDeduction}
              onUpdate={(d) => {
                setSelectedDeduction(d);
                setShowEditModal(false);
              }}
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
