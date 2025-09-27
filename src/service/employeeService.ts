import api from  "@/config/api";
import type { Employee, ApiResponse, CreateEmployeeRequest, UpdateEmployeeRequest } from "@/types/employee";


class EmployeeService {

    async getAll(): Promise<Employee[]> {
        const response = await api.get<ApiResponse<Employee[]>>("/employee/");
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch employees');
        }
        return response.data.data;
    
    }

    async getById(id: string): Promise<Employee> {
        const response = await api.get<ApiResponse<Employee[]>>(`/employee/${id}`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch employee');
        }
        // Backend returns an array, so we take the first element
        const employees = response.data.data;
        if (!employees || employees.length === 0) {
            throw new Error('Employee not found');
        }
        return employees[0];
    }

    async getAllActive(): Promise<Employee[]> {
        const response = await api.get<ApiResponse<Employee[]>>("/employee/active");
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch employees');
        }
        return response.data.data;
    }

    async create(employee: CreateEmployeeRequest): Promise<Employee> {
        const response = await api.post<ApiResponse<Employee>>("/employee/", employee);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to create employee');
        }
        return response.data.data;
    }

    async update(id: string, employee: UpdateEmployeeRequest): Promise<Employee> {
        const response = await api.put<ApiResponse<Employee>>(`/employee/${id}`, employee);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to update employee');
        }
        return response.data.data;
    }

    async delete(id: string): Promise<null> {
        const response = await api.delete<ApiResponse<null>>(`/employee/${id}`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to delete employee');
        }
        return response.data.data;
    }

}

export const employeeService = new EmployeeService();