import api from "@/config/api";
import type { Department, createDepartment, updateDepartment, ApiResponse } from "@/types/department";


class DepartmentService {
    async getAll(): Promise<Department[]> {
        console.log("Fetching all departments...");
        const response = await api.get<ApiResponse<Department[]>>("/department/");
        console.log("Raw getAll response:", response.data);
        
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch departments');
        }
        
        // Since backend returns proper JSON, we can use the data directly
        const departments = response.data.data;
        
        console.log("Processed departments data:", departments);
        return departments;
    }

    async getActive(): Promise<Department[]> {
        const response = await api.get<ApiResponse<Department[]>>("/department/active");
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch active departments');
        }
        
        // Since backend returns proper JSON, we can use the data directly
        const departments = response.data.data;
        
        return departments;
    }

    async getById(id: string): Promise<Department> {
        const response = await api.get<ApiResponse<Department>>(`/department/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch department');
        }
        
        // Since backend returns proper JSON, we can use the data directly
        const result = response.data.data;
        
        return result;
    }

    async create(data: createDepartment): Promise<Department> {
        console.log("Sending department data:", data);
        const response = await api.post<ApiResponse<Department>>("/department/", data);
        console.log("Raw API response:", response.data);
        
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to create department');
        }
        //array of objects
        const result = response.data.data;
        return Array.isArray(result) ? result[0] : result;

    }

    async update(id: string, data: updateDepartment): Promise<Department> {
        const response = await api.put<ApiResponse<Department>>(`/department/${id}`, data);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update department');
        }
        //array of objects
        const result = response.data.data;
        return Array.isArray(result) ? result[0] : result;
    }

    async delete(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete<ApiResponse<{ success: boolean; message: string }>>(`/department/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete department');
        }
        // Handle case where API returns array instead of single object
        const result = response.data.data;
        return Array.isArray(result) ? result[0] : result;
           
    }
}

export const departmentService = new DepartmentService();