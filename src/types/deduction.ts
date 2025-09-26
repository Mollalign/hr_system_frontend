// API Request/Response interfaces
export interface DeductionTypeRequest {
    id: string;
    type: string;
    data: TaxBracket[] | PensionData[] | OtherDeductionData[];
    is_active: boolean;
    description: string;
}

// API-specific request interface
export interface DeductionApiRequest {
    type: string;
    data: TaxBracket[] | PensionData[] | OtherDeductionData[];
    is_active: boolean;
}

export interface DeductionType {
    id: string;
    type: string;
    data: TaxBracket[] | PensionData[] | OtherDeductionData[];
    is_active: boolean;
    description: string;
}

export interface ApiResponse<T> {
    status_code: number;
    success: boolean;
    message: string;
    data: T;
}

export interface TaxBracket {
    name: string
    min_salary: number
    max_salary: number | "UNLIMITED"
    rate: number
    deduction: number
    id?: string
}

export interface PensionData {
    percentage: number
    id?: string
}

export interface OtherDeductionData {
    name: string
    type: "fixed" | "percentage"
    percentage: number
    amount: number
    description: string
    is_active: boolean
    id?: string
}

// Legacy interface for form handling
export interface OtherDeduction {
    name: string
    type: "fixed" | "percentage"
    percentage: number
    amount: number
    description: string
}