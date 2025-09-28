/* eslint-disable @typescript-eslint/no-explicit-any */
// types/payroll.ts
export interface PayrollEmployee {
    id: string
    employee_id: {
      id: string
      full_name: string
    }
    basic_salary: number
    department: {
      id: string
      name: string
      manager_name: string
    }
    allowance: {
      TOTAL: number
      ALLOWANCE: any[]
    }
    deduction: {
      TAX: {
        id: string
        name: string
        rate: number
        deduction: number
        max_salary: number | null
        min_salary: number
      }
      OTHER: any[]
      TOTAL: number
      PENSION: {
        id: string
        percentage: number
      }
    }
    payment_date: string
  }
  
//   export interface ApiResponse {
//     status: boolean
//     status_code: number
//     message: string
//     data: PayrollEmployee[]
//   }

export interface ApiResponse<T> {
    status_code: number;
    status: boolean;
    message: string;
    data: T;
}

export interface SinglePayrollResponse {
    status_code: number;
    status: boolean;
    message: string;
    data: PayrollEmployee;
}
  
