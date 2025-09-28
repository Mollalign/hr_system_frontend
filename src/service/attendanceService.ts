import api from "@/config/api";
import type {
  Attendance,
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  ApiResponse,
} from "@/types/attendace";


class AttendanceService {
  async getAll(): Promise<Attendance[]> {
  console.log("Fetching all attendances...")
    const response = await api.get<ApiResponse<Attendance[]>>("/attendance/");
    console.log("[] Raw get All response:",response.data);
    if (!response.data.success) throw new Error(response.data.message||'Failed to fetch attendances');
    return response.data.data
   
  }

  async create(payload: CreateAttendanceRequest): Promise<Attendance> {
    console.log("🚀 Creating attendance with payload:", payload);
    const response = await api.post<ApiResponse<Attendance[]>>("/attendance/", payload);
    console.log("📥 Create attendance response:", response.data);
    
    if (!response.data.success) throw new Error(response.data.message);
    
    // Backend returns an array, so we take the first element
    const attendances = response.data.data;
    if (!attendances || attendances.length === 0) {
      throw new Error('No attendance record returned from server');
    }
    
    return attendances[0];
  }

  async update(id: string, payload: UpdateAttendanceRequest): Promise<Attendance> {
    console.log("🚀 Updating attendance with payload:", payload);
    const response = await api.put<ApiResponse<Attendance[]>>(`/attendance/${id}`, payload);
    console.log("📥 Update attendance response:", response.data);
    
    if (!response.data.success) throw new Error(response.data.message);
    
    // Backend returns an array, so we take the first element
    const attendances = response.data.data;
    if (!attendances || attendances.length === 0) {
      throw new Error('No attendance record returned from server');
    }
    
    return attendances[0];
  }

}

export const attendanceService = new AttendanceService();
