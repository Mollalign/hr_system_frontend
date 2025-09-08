export interface CompanyAddress {
    id: string;
    branch_name: string;
    branch_phone: string;
    branch_email: string;
    branch_address: string;
    is_active: boolean;
}

export interface CreateCompanyAddressRequest {
    branch_name: string;
    branch_phone: string;
    branch_email: string;
    branch_address: string;
    is_active: boolean;
}

export interface UpdateCompanyAddressRequest {
    id: string;
    branch_name: string;
    branch_phone: string;
    branch_email: string;
    branch_address: string;
    is_active: boolean;
}

// Standardized API response type
export interface ApiResponse<T> {
    status_code: number;
    success: boolean;
    message: string;
    data: T;
}