import api from "@/config/api"
import type { Allowance, ApiResponse, CreateAllowanceRequest, UpdateAllowanceRequest } from "@/types/allowance";

class AllowanceService {

    async getAll(): Promise<Allowance[]> {
        const response = await api.get<ApiResponse<Allowance[]>>("/allowance/");
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch allowances');
        }
        return response.data.data;
    }

    async getActive(): Promise<Allowance[]> {
        const response = await api.get<ApiResponse<Allowance[]>>("/allowance/active");
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch active allowances');
        }
        return response.data.data;
    }

    async getById(id: string): Promise<Allowance> {
        const response = await api.get<ApiResponse<Allowance>>(`/allowance/${id}`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch allowance');
        }
        return response.data.data;
    }

    async create(data: CreateAllowanceRequest): Promise<Allowance> {
        const response = await api.post<ApiResponse<Allowance>>("/allowance/", data);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to create allowance');
        }
        // Handle case where API returns array instead of single object
        const result = response.data.data;
        return Array.isArray(result) ? result[0] : result;
    }

    async update(id: string, data: UpdateAllowanceRequest): Promise<Allowance> {
        const response = await api.put<ApiResponse<Allowance>>(`/allowance/${id}`, data);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to update allowance');
        }
        // Handle case where API returns array instead of single object
        const result = response.data.data;
        return Array.isArray(result) ? result[0] : result;
    }

    async delete(id: string): Promise<{ status: boolean; message: string }> {
        const response = await api.delete<ApiResponse<{ status: boolean; message: string }>>(`/allowance/${id}`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to delete allowance');
        }
        return response.data.data;
    }

}

export const allowanceService = new AllowanceService();