export interface Employee {
  id: string;
  full_name: string;
  work_location: string;
}

export interface AttendanceStatus {
  leave: boolean;
  other: boolean;
  absent: boolean;
  holiday: boolean;
  late_in: boolean;
  present: boolean;
  overtime: boolean;
  early_out: boolean;
  on_time_in: boolean;
  permission: boolean;
  on_time_out: boolean;
  missing_checkout: boolean;
}

export interface Attendance {
  id: string;
  employee: Employee;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: AttendanceStatus;
}

export interface CreateAttendanceRequest {
  employee_id: string;
  check_in_time: string; // Format: "HH:MM:SS"
}

export interface UpdateAttendanceRequest {
  employee_id: string;
  attendance_date: string;
  check_out_time: string; // Format: "HH:MM:SS"
}

export interface ApiResponse<T> {
  status_code: number;
  success: boolean;
  message: string;
  data: T;
}
  