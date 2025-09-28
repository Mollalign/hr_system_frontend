/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Edit,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
} from "lucide-react";
import { AddAttendanceModal } from "./modals/add-attendance";
import { EditAttendanceModal } from "./modals/edit-modal";
import { useAttendance } from "@/hooks/useattendance";
import type {
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
} from "@/types/attendace";
import { toast } from "sonner";
// import type {Attendance }from '@/types/attendace';
import { exportAttendaceToExcel } from "@/utils/export";

export default function AttendanceList() {
  const { attendance, loading, error, createAttendance, updateAttendance } =
    useAttendance();

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  // const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  // const [currentYear] = useState(new Date().getFullYear());
  const [addAttendanceModalOpen, setAddAttendanceModalOpen] = useState(false);
  const [isAddingAttendance, setIsAddingAttendance] = useState(false);
  const [editAttendanceModalOpen, setEditAttendanceModalOpen] = useState(false);
  const [attendanceToEdit, setAttendanceToEdit] = useState<any>(null);
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const mappedAttendance = useMemo(() => {
    return attendance.map((att) => {
      // Use the employee data from the API response
      const employee = att.employee;

      // Determine if present based on check-in and check-out times
      // const isPresent = Boolean(att.check_in_time && att.check_out_time);

      // Calculate working hours
      let workingHours = "-";
      if (att.check_in_time && att.check_out_time) {
        // Parse time strings (format: "HH:MM:SS" or "HH:MM")
        const parseTime = (timeStr: string) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes; // Convert to total minutes
        };

        const checkInMinutes = parseTime(att.check_in_time);
        const checkOutMinutes = parseTime(att.check_out_time);
        const diffMinutes = checkOutMinutes - checkInMinutes;

        if (diffMinutes > 0) {
          const hours = Math.floor(diffMinutes / 60);
          const minutes = diffMinutes % 60;
          workingHours = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}`;
        }
      }

      // Determine display status based on check-in and check-out times
      let displayStatus = "Absent";

      if (att.check_in_time && att.check_out_time) {
        displayStatus = "Present";
      } else if (att.check_in_time && !att.check_out_time) {
        displayStatus = "Checked In";
      } else if (att.status.leave) {
        displayStatus = "On Leave";
      } else if (att.status.holiday) {
        displayStatus = "Holiday";
      } else {
        displayStatus = "Absent";
      }

      // Format time display (convert "HH:MM:SS" to "HH:MM")
      const formatTime = (timeStr: string | null) => {
        if (!timeStr) return "-";
        const [hours, minutes] = timeStr.split(":");
        return `${hours}:${minutes}`;
      };

      return {
        ...att,
        employeeName: employee?.full_name || "-",
        checkIn: formatTime(att.check_in_time),
        checkOut: formatTime(att.check_out_time),
        workingHours: workingHours,
        date: att.attendance_date
          ? new Date(att.attendance_date).toLocaleDateString()
          : "-",
        displayStatus: displayStatus,
        location: employee?.work_location || "-",
      };
    });
  }, [attendance]);

  const filteredAttendances = useMemo(() => {
    return mappedAttendance.filter((att) => {
      const attendanceDate = new Date(att.attendance_date);
      const isSameDay =
        attendanceDate.toDateString() === selectedDate.toDateString();

      const employeeName = att.employeeName || "";
      const date = att.date || "";
      const displayStatus = att.displayStatus || "";
      const searchTermLower = searchTerm.toLowerCase();

      const searchTermMatch =
        employeeName.toLowerCase().includes(searchTermLower) ||
        date.toLowerCase().includes(searchTermLower) ||
        displayStatus.toLowerCase().includes(searchTermLower);

      return isSameDay && searchTermMatch;
    });
  }, [mappedAttendance, searchTerm, selectedDate]);

  const totalWorkingDays = filteredAttendances.length;
  const totalPresentDays = filteredAttendances.filter(
    (att) => att.displayStatus === "Present"
  ).length;
  const totalCheckedInDays = filteredAttendances.filter(
    (att) => att.displayStatus === "Checked In"
  ).length;
  const totalAbsentDays = filteredAttendances.filter(
    (att) => att.displayStatus === "Absent"
  ).length;

  const employeeHoursMap: Record<string, number> = {};
  filteredAttendances.forEach((att) => {
    if (
      att.displayStatus === "Present" &&
      att.workingHours &&
      att.workingHours !== "-"
    ) {
      const [hours, minutes] = att.workingHours.split(":").map(Number);
      const totalHours = hours + minutes / 60;
      if (!employeeHoursMap[att.employeeName])
        employeeHoursMap[att.employeeName] = 0;
      employeeHoursMap[att.employeeName] += totalHours;
    }
  });

  const employeeCount = Object.keys(employeeHoursMap).length;
  const sumHours = Object.values(employeeHoursMap).reduce((a, b) => a + b, 0);
  const averageWorkingHours =
    employeeCount > 0 ? (sumHours / employeeCount).toFixed(2) : "0.00";

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleAddAttendance = async (
    newAttendanceData: CreateAttendanceRequest
  ) => {
    console.log("🔧 handleAddAttendance called with:", newAttendanceData);
    setIsAddingAttendance(true);
    try {
      await createAttendance(newAttendanceData);
      console.log("✅ Attendance added successfully, closing modal");
      setAddAttendanceModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to add attendance:", error);
      toast.error("Attendance for an Employee alredy Exists");
      // throw error;
    } finally {
      setIsAddingAttendance(false);
    }
  };

  const handleOpenEditModal = (att: any) => {
    setAttendanceToEdit(att);
    setEditAttendanceModalOpen(true);
  };

  const handleSaveEditedAttendance = async (
    attendanceId: string,
    newCheckOutTimeStr: string
  ) => {
    console.log("🔧 handleSaveEditedAttendance called with:", {
      attendanceId,
      newCheckOutTimeStr,
    });
    setIsEditingAttendance(true);
    try {
      // Find the attendance record to get employee_id and attendance_date
      const attendanceRecord = attendance.find(
        (att) => att.id === attendanceId
      );
      if (!attendanceRecord) {
        throw new Error("Attendance record not found");
      }

      const updatedFields: UpdateAttendanceRequest = {
        employee_id: attendanceRecord.employee.id,
        attendance_date: attendanceRecord.attendance_date,
        check_out_time: newCheckOutTimeStr,
      };

      console.log("🔧 Sending update request to backend:", updatedFields);
      await updateAttendance(attendanceId, updatedFields);
      console.log("✅ Attendance updated successfully, closing modal");
      setEditAttendanceModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to save attendance:", error);
    } finally {
      setIsEditingAttendance(false);
    }
  };

  // Navigtion handlers
  const handlePrevDate = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDate = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  return (
    <div className="px-6 w-full">
      <h1 className="text-2xl font-title text-foreground pt-8 mb-10">
        Attendance
      </h1>

      {/* Top Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 flex-wrap">
        {/* Left section: Show entries + Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 flex-1">
          {/* Show entries */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={String(entriesToShow)}
              onValueChange={(value) => setEntriesToShow(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder={entriesToShow} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 h-10 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Right section: Date controls + Add/Export */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2 flex-wrap mt-2 md:mt-0">
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" onClick={handlePrevDate}>
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous Month</span>
            </Button>
            <Button variant="ghost" onClick={handleToday}>
              Today
            </Button>
            <Button variant="ghost" onClick={handleNextDate} disabled={isToday}>
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Next Month</span>
            </Button>
          </div>

          {/* <Select
            value={String(currentMonth)}
            onValueChange={(value) => setCurrentMonth(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={months[currentMonth]} />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={String(index)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <Button
            onClick={() => setAddAttendanceModalOpen(true)}
            className="bg-primary hover:bg-primary/80 text-white w-full sm:w-auto"
          >
            Add Attendance
          </Button>

          <Button
            onClick={() => exportAttendaceToExcel(filteredAttendances)}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            Export to Excel
          </Button>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-6">
        <div className="bg-purple-100 border-purple-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
          <Clock className="w-8 h-8 text-purple-600 mb-1" />
          <p className="text-xs font-medium text-purple-600">
            Average Daily Hours
          </p>
          <p className="text-xl font-bold text-purple-600">
            {averageWorkingHours}
          </p>
        </div>
        <div className="bg-blue-100 border-blue-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-blue-600 mb-1" />
          <p className="text-xs font-medium text-blue-600">
            Total Active Employees
          </p>
          <p className="text-xl font-bold text-blue-600">{totalWorkingDays}</p>
        </div>
        <div className="bg-green-100 border-green-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 mb-1" />
          <p className="text-xs font-medium text-green-600">
            Total Present Employees
          </p>
          <p className="text-xl font-bold text-green-600">{totalPresentDays}</p>
        </div>
        <div className="bg-red-100 border-red-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
          <XCircle className="w-8 h-8 text-red-600 mb-1" />
          <p className="text-xs font-medium text-red-600">
            Total Absent Employees
          </p>
          <p className="text-xl font-bold text-red-600">{totalAbsentDays}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-lg border bg-card overflow-hidden mb-10">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted hover:bg-muted">
              <TableHead className="px-6 py-4 font-title text-foreground">
                Employee Name
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Date
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Check In
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Check Out
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Working Hours
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Location
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 font-title text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-48 text-muted-foreground"
                >
                  Loading attendance records...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-48 text-red-500"
                >
                  Error loading attendance records: {String(error)}
                </TableCell>
              </TableRow>
            ) : filteredAttendances.length > 0 ? (
              filteredAttendances.slice(0, entriesToShow).map((att) => (
                <TableRow key={att.id} className="border-b last:border-b-0">
                  <TableCell className="px-6 py-5 font-title text-foreground">
                    {att.employeeName}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">
                    {att.date}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">
                    {att.checkIn}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">
                    {att.checkOut}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">
                    {att.workingHours}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">
                    {att.location}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        att.displayStatus === "Present"
                          ? "bg-green-100 text-green-800"
                          : att.displayStatus === "Checked In"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          att.displayStatus === "Present"
                            ? "bg-green-500"
                            : att.displayStatus === "Checked In"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {att.displayStatus}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(att)}
                      disabled={att.check_out_time !== null}
                      title={
                        att.check_out_time !== null
                          ? "Check-out time already set"
                          : "Add check-out time"
                      }
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">
                        {att.check_out_time !== null
                          ? "Check-out time already set"
                          : "Add check-out time"}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-48 text-muted-foreground"
                >
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddAttendanceModal
        open={addAttendanceModalOpen}
        onOpenChange={setAddAttendanceModalOpen}
        onAdd={handleAddAttendance}
        loading={isAddingAttendance}
      />
      <EditAttendanceModal
        open={editAttendanceModalOpen}
        onOpenChange={setEditAttendanceModalOpen}
        attendanceToEdit={attendanceToEdit}
        onSave={(attendanceId, newCheckOutTime) =>
          handleSaveEditedAttendance(attendanceId, newCheckOutTime)
        }
        loading={isEditingAttendance}
      />
    </div>
  );
}
