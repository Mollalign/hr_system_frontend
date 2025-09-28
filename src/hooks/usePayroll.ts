import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import payrollService from "@/service/payrollService";
import type { PayrollEmployee } from "@/types/payroll";

export const payrollKeys = {
    all: ['payrolls'] as const,
    lists: () => [...payrollKeys.all, 'list'] as const,
    list: (filters: string) => [...payrollKeys.lists(), { filters }] as const,
    details: () => [...payrollKeys.all, 'detail'] as const,
    detail: (id: string) => [...payrollKeys.details(), id] as const,
}

export function usePayrolls() {
    return useQuery({
        queryKey: payrollKeys.lists(),
        queryFn: () => payrollService.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    })
}

export function usePayroll(id: string) {
    return useQuery({
        queryKey: payrollKeys.detail(id),
        queryFn: () => payrollService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    })
}

export function useCreatePayroll() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payroll: PayrollEmployee) => payrollService.create(payroll),
        onSuccess: () => {
            toast.success("Payroll created successfully")
            queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
        },
        onError: () => {
            toast.error("Failed to create payroll")
        }
    })
}

export function useCreatePayrollByEmployeeId() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ employeeId, payroll }: { employeeId: string, payroll: PayrollEmployee }) => payrollService.createByEmployeeId(employeeId, payroll),
        onSuccess: () => {
            toast.success("Payroll created successfully")
            queryClient.invalidateQueries({ queryKey: payrollKeys.lists() })
        },
        onError: () => {
            toast.error("Failed to create payroll")
        }
    })
}