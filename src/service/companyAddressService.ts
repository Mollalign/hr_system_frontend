import api from "@/config/api";
import type { CompanyAddress, CreateCompanyAddressRequest, UpdateCompanyAddressRequest, ApiResponse } from "../types/companyAddress";


class CompanyAddressService {

    async getAll(): Promise<CompanyAddress[]> {
        const response = await api.get<ApiResponse<CompanyAddress[]>>("/company_address/");
        
        // Check if the response is successful
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch company addresses');
        }
        
        return response.data.data;
    }

    async getActive(): Promise<CompanyAddress[]> {
        const response = await api.get<ApiResponse<CompanyAddress[]>>("/company_address/active");
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch active company addresses');
        }
        return response.data.data;
    }
    
    async getById(id: string): Promise<CompanyAddress> {
        const response = await api.get<ApiResponse<CompanyAddress>>(`/company_address/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch company address');
        }
        return response.data.data;
    }

    async create(data: CreateCompanyAddressRequest): Promise<CompanyAddress> {
        const response = await api.post<ApiResponse<CompanyAddress>>("/company_address/", data);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to create company address');
        }
        return response.data.data;
    }

    async update(id: string, data: UpdateCompanyAddressRequest): Promise<CompanyAddress> {
        const response = await api.put<ApiResponse<CompanyAddress>>(`/company_address/${id}`, data);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update company address');
        }
        return response.data.data;
    }

    async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<ApiResponse<null>>(`/company_address/${id}`);
    return { success: response.data.success, message: response.data.message };
    }
} 

export const companyAddressService = new CompanyAddressService();
