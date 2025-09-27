import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/service/employeeService";
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from "@/types/employee";
import { toast } from "sonner";

// Query keys for consistent caching
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: string) => [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  active: () => [...employeeKeys.all, 'active'] as const,
};

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: () => employeeService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });
}

export function useEmployeeActive() {
  return useQuery({
    queryKey: employeeKeys.active(),
    queryFn: () => employeeService.getAllActive(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: CreateEmployeeRequest) => employeeService.create(employee),
    onSuccess: (data) => {
      queryClient.setQueryData(employeeKeys.detail(data.id), data);
      
      //invaidate employee list so UI reffreshes automatically
      queryClient.invalidateQueries({queryKey: employeeKeys.lists()})
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("❌ Error creating employee:", error);
      toast.error("❌ Error creating employee:", error.message);
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, employee }: { id: string; employee: UpdateEmployeeRequest }) => 
      employeeService.update(id, employee),
    onSuccess: (data) => {
      queryClient.setQueryData(employeeKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success("✅ Employee updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("❌ Error updating employee:", error);
      toast.error("❌ Error updating employee: " + error.message);
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("❌ Error deleting employee:", error);
      toast.error("❌ Error deleting employee:", error.message);
    },
  });
}

// Legacy hook for backward compatibility
export function useEmployeeLegacy() {
  const queryClient = useQueryClient();
  const employeesQuery = useEmployees();

  const getEmployeeById = async (id: string): Promise<Employee | null> => {
    try {
      // Try to get from cache first
      const cachedEmployee = queryClient.getQueryData<Employee>(employeeKeys.detail(id));
      if (cachedEmployee) {
        return cachedEmployee;
      }

      // If not in cache, fetch it
      const response = await employeeService.getById(id);
      // Cache the result
      queryClient.setQueryData(employeeKeys.detail(id), response);
      return response;
    } catch (err) {
      console.error("❌ Error fetching employee:", err);
      return null;
    }
  };

  const createEmployee = async (employee: CreateEmployeeRequest) => {
    try {
      const response = await employeeService.create(employee);
      queryClient.setQueryData(employeeKeys.detail(response.id), response);
      return response;
    } catch (err) {
      console.error("❌ Error creating employee:", err);
      return null;
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      const response = await employeeService.delete(id);
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      return response;
    } catch (err) {
      console.error("❌ Error deleting employee:", err);
      return null;
    }
  }

  return {
    employees: employeesQuery.data || [],
    loading: employeesQuery.isLoading,
    error: employeesQuery.error?.message || null,
    getEmployees: () => queryClient.invalidateQueries({ queryKey: employeeKeys.lists() }),
    getEmployeeById,
    createEmployee,
    deleteEmployee,
  };
}