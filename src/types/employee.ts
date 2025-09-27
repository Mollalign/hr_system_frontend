export interface ApiResponse<T> {
  status: boolean;
  status_code: number;
  message: string;
  data: T;
}

export interface Department {
  id: string;
  name: string;
  manager_name: string;
  is_active: boolean;
}

export interface WorkLocation {
  id: string;
  branch_name: string;
  branch_phone: string;
  branch_email: string;
  branch_address: string;
  is_active: boolean;
}

export interface Allowance {
  id: string;
  name: string;
  type: string;
  percentage: number;
  amount: number;
  description: string;
  is_active: boolean;
}

export interface Deduction {
  id: string;
  type: string;
  data: string[];
  is_active: boolean;
  description: string;
}

export interface Employee {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string; // ISO date string
  maternal_status: string;
  nationality: string;
  email: string;
  phone_number: string;
  alternative_phone_number: string;
  permanent_address: string;
  current_address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  contact_person_name: string;
  contact_person_relationship: string;
  contact_person_phone: string;
  contact_person_alternative_phone: string;
  contact_person_address: string;
  employee_code: string;
  job_title: string;
  department: Department;
  hire_date: string;
  employee_type: string;
  employment_shift: string;
  employment_status: string;
  work_location: WorkLocation;
  bank_account_number: string;
  basic_salary: number;
  allowance: Allowance[];
  deduction: Deduction[];
  effective_date: string;
  currency_of_salary: string;
  is_active: boolean;
}

export interface CreateEmployeeRequest {
  full_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  maternal_status: string;
  nationality: string;
  email: string;
  phone_number: string;
  alternative_phone_number: string;
  permanent_address: string;
  current_address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  contact_person_name: string;
  contact_person_relationship: string;
  contact_person_phone: string;
  contact_person_alternative_phone: string;
  contact_person_address: string;
  employee_code: string;
  job_title: string;
  department: string;        // only department id
  employee_type: string;
  employment_shift: string;
  employment_status: string;
  hire_date: string;
  work_location: string;     // only work_location id
  bank_account_number: string;
  basic_salary: number;
  allowance: string[];       // array of allowance ids
  deduction: string[];       // array of deduction ids
  effective_date: string;
  currency_of_salary: string;
  cv_file: string | null;
  is_active: boolean;
}

export interface UpdateEmployeeRequest {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  gender: string;
  date_of_birth: string;
  maternal_status: string;
  nationality: string;
  email: string;
  phone_number: string;
  alternative_phone_number: string;
  permanent_address: string;
  current_address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  contact_person_name: string;
  contact_person_relationship: string;
  contact_person_phone: string;
  contact_person_alternative_phone: string;
  contact_person_address: string;
  employee_code: string;
  job_title: string;
  department: string;        // only department id
  employee_type: string;
  employment_shift: string;
  employment_status: string;
  hire_date: string;
  work_location: string;     // only work_location id
  bank_account_number: string;
  basic_salary: number;
  allowance: string[];       // array of allowance ids
  deduction: string[];       // array of deduction ids
  effective_date: string;
  currency_of_salary: string;
  cv_file: File | null;
  cv_file_url?: string; 
  is_active: boolean;
}

// ✅ API response type for "get employees"
export type EmployeeResponse = ApiResponse<Employee[]>;
  