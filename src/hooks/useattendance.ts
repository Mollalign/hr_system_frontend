import { useState, useEffect } from "react";
import { attendanceService } from "@/service/attendanceService";
import type {
  Attendance,
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
} from "@/types/attendace";
function calculateWorkingHours(att: Attendance): number {
  if (!att.check_in_time || !att.check_out_time) return 0;
  
  // Parse time strings (format: "HH:MM:SS")
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to total minutes
  };
  
  const checkInMinutes = parseTime(att.check_in_time);
  const checkOutMinutes = parseTime(att.check_out_time);
  const diffMinutes = checkOutMinutes - checkInMinutes;
  
  if (diffMinutes > 0) {
    return diffMinutes / 60; // Convert to hours
  }
  
  return 0;
}

export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await getAttendance();
    }
    fetchData()
  }, []);

  const getAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getAll();
      const withHours = data.map(att => ({
        ...att,
        workingHours: calculateWorkingHours(att),
      }));
      setAttendance(withHours);
    } catch {
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const createAttendance = async (payload: CreateAttendanceRequest) => {
    try {
      console.log("🔧 Creating attendance in hook:", payload);
      const newAtt = await attendanceService.create(payload);
      console.log("🔧 Created attendance:", newAtt);
      setAttendance(prev => [...prev, { ...newAtt, workingHours: calculateWorkingHours(newAtt) }]);
    } catch (error) {
      console.error("❌ Error creating attendance in hook:", error);
      throw error;
    }
  };

  const updateAttendance = async (id: string, payload: UpdateAttendanceRequest) => {
    try {
      console.log("🔧 Updating attendance in hook:", { id, payload });
      const updated = await attendanceService.update(id, payload);
      console.log("🔧 Updated attendance:", updated);
      setAttendance(prev =>
        prev.map(att =>
          att.id === id ? { ...updated, workingHours: calculateWorkingHours(updated) } : att
        )
      );
    } catch (error) {
      console.error("❌ Error updating attendance in hook:", error);
      throw error;
    }
  };

  // 📊 Stats
  const totalPresent = attendance.filter(a => a.status.present).length;
  const totalAbsent = attendance.filter(a => a.status.absent).length;
  const avgWorkingHours =
    attendance.length > 0
      ? attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0) / attendance.length
      : 0;

  return {
    attendance,
    loading,
    error,
    getAttendance,
    createAttendance,
    updateAttendance,
    totalPresent,
    totalAbsent,
    avgWorkingHours,
  };
}
