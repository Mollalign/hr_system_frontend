import * as XLSX from "xlsx";
import type { Attendance } from "@/types/attendace";
import type { PayrollEmployee } from "@/types/payroll";

export const exportAttendaceToExcel = (attendanceList: Attendance[]) => {
  if (!attendanceList || attendanceList.length === 0) {
    alert("No attendance data to export!");
    return;
  }

  // Map attendance data to a simple format suitable for Excel
  const dataForExcel = attendanceList.map((att) => ({
    "Employee Name": att.employee?.full_name || "-",
    Date: att.attendance_date
      ? new Date(att.attendance_date).toLocaleDateString()
      : "-",
    "Check In": att.check_in_time || "-",
    "Check Out": att.check_out_time || "-",
    "Working Hours":
      att.check_in_time && att.check_out_time
        ? (() => {
            const [inH, inM] = att.check_in_time.split(":").map(Number);
            const [outH, outM] = att.check_out_time.split(":").map(Number);
            const minutes = outH * 60 + outM - (inH * 60 + inM);
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours.toString().padStart(2, "0")}:${mins
              .toString()
              .padStart(2, "0")}`;
          })()
        : "-",
    Location: att.employee?.work_location || "-",
    Status: att.status.leave
      ? "On Leave"
      : att.status.holiday
      ? "Holiday"
      : att.check_in_time && att.check_out_time
      ? "Present"
      : att.check_in_time
      ? "Checked In"
      : "Absent",
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // Export to Excel file
  XLSX.writeFile(workbook, "attendance.xlsx");
};

export const exportPayrollToExcel = (payrollList: PayrollEmployee[]) => {
  if (!payrollList || payrollList.length === 0) {
    alert("No payroll data to export!");
    return;
  }
  const dataForExcel = payrollList.map((payroll) => ({
    "Employee Name": payroll.employee_id.full_name,
    "Employee ID": payroll.employee_id.id,
    "Department": payroll.department.name,
    "Manager": payroll.department.manager_name,
    "Basic Salary": payroll.basic_salary,
    "Allowance": payroll.allowance.TOTAL,
    "Deduction": payroll.deduction.TOTAL,
    "Tax Deduction": payroll.deduction.TAX.deduction,
    "Pension Deduction": payroll.deduction.PENSION.percentage,
    "Tax Rate": payroll.deduction.TAX.rate,
    "Pension Rate": payroll.deduction.PENSION.percentage,
    "Net Salary": payroll.basic_salary + payroll.allowance.TOTAL - payroll.deduction.TOTAL,
    "Payment Date": payroll.payment_date,
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");
  XLSX.writeFile(workbook, "payroll.xlsx");
};
