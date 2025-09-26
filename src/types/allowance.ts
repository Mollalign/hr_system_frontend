export interface Allowance {
    id: string;
    name: string;
    description: string;
    type: AllowanceType;
    percentage: number;
    amount: number;
    is_active: boolean;
}

// export type AllowanceType = "percentage" | "fixed";

// export enum AllowanceType {
//     PERCENTAGE = 'percentage',
//     FIXED = 'fixed'
// }

export const AllowanceType = {
  PERCENTAGE: "percentage",
  FIXED: "fixed"
} as const;

export type AllowanceType = typeof AllowanceType[keyof typeof AllowanceType];


export interface CreateAllowanceRequest {
    name: string;
    description: string;
    type: AllowanceType;
    percentage: number;
    amount: number;
    is_active: boolean;
}

export interface UpdateAllowanceRequest extends CreateAllowanceRequest {
    id: string;
}

export interface AllowanceResponse {
    id: string;
    name: string;
    description: string;
    type: AllowanceType;
    percentage: number;
    amount: number;
    is_active: boolean;
}

export interface ApiResponse<T> {
    status_code: number;
    status: boolean;
    message: string;
    data: T;
}