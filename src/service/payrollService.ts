import  api  from "@/config/api";
import type { PayrollEmployee, ApiResponse, SinglePayrollResponse } from "@/types/payroll";

class PayrollService {
    async getAll(): Promise<PayrollEmployee[]> {
        const response = await api.get<ApiResponse<PayrollEmployee[]>>("/payroll/");
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch payroll items');
        }
        return response.data.data;
    }

    async getById(id: string): Promise<PayrollEmployee> {
        const response = await api.get<SinglePayrollResponse>(`/payroll/${id}`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch payroll item');
        }
        return response.data.data;
    }

    async getByEmployeeId(employeeId: string): Promise<PayrollEmployee[]> {
        const response = await api.get<ApiResponse<PayrollEmployee[]>>(`/payroll/employee/${employeeId}`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch payroll items');
        }
        return response.data.data;
    }

    async create(payroll: PayrollEmployee): Promise<PayrollEmployee> {
        const response = await api.post<ApiResponse<PayrollEmployee>>("/payroll/", payroll);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to create payroll item');
        }
        return response.data.data;
    }

    async createByEmployeeId(employee_id: string, payroll: PayrollEmployee): Promise<PayrollEmployee> {
        const response = await api.post<ApiResponse<PayrollEmployee>>(`/payroll/employee/${employee_id}`, payroll);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to create payroll item');
        }
        return response.data.data;
    }
}

export default new PayrollService();