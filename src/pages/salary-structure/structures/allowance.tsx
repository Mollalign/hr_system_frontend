"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl md:text-2xl font-semibold">💰 Allowances</h2>
          <Button
            className="bg-primary hover:bg-primary/80 text-white rounded-xl shadow-sm"
            onClick={() => setIsAddAllowanceModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Allowance
          </Button>
        </div>
        <div className="rounded-xl border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive font-medium">Error loading allowances</p>
          <p className="text-destructive/80 text-sm mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => getAllowances()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl md:text-2xl font-semibold">💰 Allowances</h2>
        <Button
          className="bg-primary hover:bg-primary/80 text-white rounded-xl shadow-sm"
          onClick={() => setIsAddAllowanceModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Allowance
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="px-6 py-3 font-medium">Name</TableHead>
              <TableHead className="px-6 py-3 font-medium">Type</TableHead>
              <TableHead className="px-6 py-3 font-medium">Percentage</TableHead>
              <TableHead className="px-6 py-3 font-medium">Amount</TableHead>
              <TableHead className="px-6 py-3 font-medium">Status</TableHead>
              <TableHead className="px-6 py-3 font-medium text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allowances.length > 0 && !loading ? (
              allowances.map((allowance) => (
                <TableRow
                  key={allowance.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-6 py-4 font-medium">
                    {allowance.name}
                  </TableCell>
                  <TableCell className="px-6 py-4">{allowance.type}</TableCell>
                  <TableCell className="px-6 py-4">
                    {allowance.percentage}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {allowance.amount}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        allowance.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          allowance.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {allowance.is_active ? "Active" : "Inactive"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-muted"
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
                        className="h-8 w-8 rounded-md hover:bg-muted"
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
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  {loading ? "Loading allowances..." : "No allowances found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {allowances.length > 0 && !loading ? (
          allowances.map((allowance) => (
            <div
              key={allowance.id}
              className="rounded-xl border p-4 shadow-sm bg-card hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base">{allowance.name}</h3>
                <div
                  className={`px-2 py-1 text-xs rounded-full ${
                    allowance.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {allowance.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Type:</span>{" "}
                  {allowance.type}
                </p>
                <p>
                  <span className="font-medium text-foreground">Percentage:</span>{" "}
                  {allowance.percentage}
                </p>
                <p>
                  <span className="font-medium text-foreground">Amount:</span>{" "}
                  {allowance.amount}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
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
                  className="rounded-lg"
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
          <p className="text-center text-muted-foreground py-6">
            {loading ? "Loading allowances..." : "No allowances found."}
          </p>
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
