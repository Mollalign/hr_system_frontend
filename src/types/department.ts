export interface Department {
    id: string;
    name: string;
    manager_name: string;
    is_active: boolean;
}

export interface createDepartment {
    name: string;
    manager_id: string | null;
    is_active: boolean;
}

export interface updateDepartment {
    id: string;
    name: string;
    manager_id: string | null;
    is_active: boolean;
}

export interface ApiResponse<T> {
    status_code: number;
    success: boolean;
    message: string;
    data: T;
}
