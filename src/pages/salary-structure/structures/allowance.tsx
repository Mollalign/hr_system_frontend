"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useAllowance } from "@/hooks/useAllowance";
import { useState } from "react";
import { AddAllowanceModal } from "../modals/add-allowance";
import { EditAllowanceModal } from "../modals/edit-allowance";
import { DeleteAllowanceModal } from "../modals/delete-allowance";
import type { Allowance, UpdateAllowanceRequest } from "@/types/allowance";
import { toast } from "sonner";

export default function Allowance() {
  const {
    allowances,
    loading,
    creating,
    updating,
    deleting,
    error,
    getAllowances,
    createAllowance,
    updateAllowance,
    deleteAllowance,
  } = useAllowance();

  const [isAddAllowanceModalOpen, setIsAddAllowanceModalOpen] = useState(false);
  const [isEditAllowanceModalOpen, setIsEditAllowanceModalOpen] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<Allowance | null>(null);
  const [deletingAllowance, setDeletingAllowance] = useState<Allowance | null>(null);
  const [isDeleteAllowanceModalOpen, setIsDeleteAllowanceModalOpen] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Allowances</h2>
          <Button className="bg-primary hover:bg-primary/80 text-white" onClick={() => setIsAddAllowanceModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Allowance
          </Button>
        </div>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive font-medium">Error loading allowances</p>
          <p className="text-destructive/80 text-sm mt-1">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => getAllowances()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Allowances</h2>
        <Button className="bg-primary hover:bg-primary/80 text-white" onClick={() => setIsAddAllowanceModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Allowance
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="rounded-lg border bg-card overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted">
              <TableHead className="px-6 py-4 font-medium">Name</TableHead>
              <TableHead className="px-6 py-4 font-medium">Type</TableHead>
              <TableHead className="px-6 py-4 font-medium">Percentage</TableHead>
              <TableHead className="px-6 py-4 font-medium">Amount</TableHead>
              <TableHead className="px-6 py-4 font-medium">Status</TableHead>
              <TableHead className="px-6 py-4 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allowances.length > 0 && !loading ? (
              allowances.map((allowance) => (
                <TableRow key={allowance.id} className="border-b last:border-b-0">
                  <TableCell className="px-6 py-5 font-medium">{allowance.name}</TableCell>
                  <TableCell className="px-6 py-5">{allowance.type}</TableCell>
                  <TableCell className="px-6 py-5">{allowance.percentage}</TableCell>
                  <TableCell className="px-6 py-5">{allowance.amount}</TableCell>
                  <TableCell className="px-6 py-5">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        allowance.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          allowance.is_active ? "bg-green-500" : "bg-gray-500"
                        }`}
                      ></span>
                      {allowance.is_active ? "Active" : "Inactive"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                        onClick={() => {
                          setEditingAllowance(allowance);
                          setIsEditAllowanceModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                        onClick={() => {
                          setDeletingAllowance(allowance);
                          setIsDeleteAllowanceModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">
                  Loading allowances...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {allowances.length > 0 && !loading ? (
          allowances.map((allowance) => (
            <div key={allowance.id} className="rounded-lg border p-4 shadow-sm bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{allowance.name}</h3>
                <div
                  className={`px-2 py-1 text-xs rounded-full ${
                    allowance.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {allowance.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><span className="font-medium text-foreground">Type:</span> {allowance.type}</p>
                <p><span className="font-medium text-foreground">Percentage:</span> {allowance.percentage}</p>
                <p><span className="font-medium text-foreground">Amount:</span> {allowance.amount}</p>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingAllowance(allowance);
                    setIsEditAllowanceModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setDeletingAllowance(allowance);
                    setIsDeleteAllowanceModalOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">Loading allowances...</p>
        )}
      </div>

      {/* Modals */}
      <AddAllowanceModal
        open={isAddAllowanceModalOpen}
        onOpenChange={setIsAddAllowanceModalOpen}
        onAdd={createAllowance}
        isLoading={creating}
      />
      <EditAllowanceModal
        open={isEditAllowanceModalOpen}
        onOpenChange={setIsEditAllowanceModalOpen}
        allowance={editingAllowance}
        onUpdate={async (updatedAllowance: UpdateAllowanceRequest) => {
          try {
            await updateAllowance(updatedAllowance.id, updatedAllowance);
            setIsEditAllowanceModalOpen(false);
            setEditingAllowance(null);
          } catch (error) {
            console.error("Failed to update allowance: ", error);
          }
        }}
        isLoading={updating}
      />
      <DeleteAllowanceModal
        open={isDeleteAllowanceModalOpen}
        onOpenChange={setIsDeleteAllowanceModalOpen}
        allowance={deletingAllowance}
        onDelete={async (allowanceId: string) => {
          try {
            await deleteAllowance(allowanceId);
            toast.success("Allowance deleted successfully");
            setIsDeleteAllowanceModalOpen(false);
            setDeletingAllowance(null);
          } catch (error) {
            console.error("Failed to delete allowance:", error);
          }
        }}
        isLoading={deleting}
      />
    </div>
  );
}
