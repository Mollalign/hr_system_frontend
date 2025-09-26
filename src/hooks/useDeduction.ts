import DeductionService from "@/service/deductionService";
import type { DeductionType, DeductionTypeRequest, DeductionApiRequest } from "@/types/deduction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const deductionKeys = {
  all: ["deductions"] as const,
  lists: () => [...deductionKeys.all, "list"] as const,
  list: (filters: string) => [...deductionKeys.lists(), { filters }] as const,
  details: () => [...deductionKeys.all, "detail"] as const,
  detail: (id: string) => [...deductionKeys.details(), id] as const,
};

export function useDeductions() {
  return useQuery({
    queryKey: deductionKeys.lists(),
    queryFn: () => DeductionService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateDeduction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeductionTypeRequest) => DeductionService.create(data),
    onSuccess: (data) => {
      queryClient.setQueryData(deductionKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: deductionKeys.lists() });
      toast.success("✅ Deduction created successfully");
    },
    onError: (error: unknown) => {
      console.error("Error creating deduction:", error);
      if (error instanceof Error) {
        toast.error("Error creating deduction: " + error.message);
      } else {
        toast.error("Error creating deduction: An unexpected error occurred");
      }
    },
  });
}

export function useUpdateDeduction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeductionApiRequest }) =>
      DeductionService.update(id, data),
    onSuccess: (data: DeductionType) => {
      queryClient.setQueryData(deductionKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: deductionKeys.lists() });
      toast.success("✏️ Deduction updated successfully");
    },
    onError: (error: unknown) => {
      console.error("Error updating deduction:", error);
      if (error instanceof Error) {
        toast.error("Error updating deduction: " + error.message);
      } else {
        toast.error("Error updating deduction: An unexpected error occurred");
      }
    },
  });
}

export function useDeleteDeduction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ category, id }: { category: string; id: string }) =>
      DeductionService.delete(category, id),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: deductionKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: deductionKeys.lists() });
      toast.success("🗑️ Deduction deleted successfully");
    },
    onError: (error: unknown) => {
      console.error("Error deleting deduction:", error);
      if (error instanceof Error) {
        toast.error("Error deleting deduction: " + error.message);
      } else {
        toast.error("Error deleting deduction: An unexpected error occurred");
      }
    },
  });
}
