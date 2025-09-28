import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { PayrollEmployee } from "@/types/payroll"

export const generatePayslip = (payroll: PayrollEmployee) => {
  const doc = new jsPDF()

  const calculatePensionAmount = () => {
    return (payroll.basic_salary * payroll.deduction.PENSION.percentage) / 100
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Header
  doc.setFontSize(16)
  doc.text("Payroll Payslip", 14, 20)
  doc.setFontSize(12)
  doc.text(`Employee: ${payroll.employee_id.full_name}`, 14, 30)
  doc.text(`Department: ${payroll.department.name}`, 14, 38)
  doc.text(`Payment Date: ${formatDate(payroll.payment_date)}`, 14, 46)

  // Salary Table
  autoTable(doc, {
    startY: 60,
    head: [["Description", "Amount"]],
    body: [
        ["Employee Name", payroll.employee_id.full_name],
        ["Employee ID", payroll.employee_id.id],
        ["Department", payroll.department.name],
        ["Manager", payroll.department.manager_name],
        ["Basic Salary", payroll.basic_salary],
        ["Allowance", payroll.allowance.TOTAL],
        ["Deduction", payroll.deduction.TOTAL],
        ["Tax Deduction", payroll.deduction.TAX.deduction],
        ["Pension Deduction", calculatePensionAmount()],
        ["Tax Rate", payroll.deduction.TAX.rate],
        ["Pension Rate", payroll.deduction.PENSION.percentage],
        ["Net Salary", payroll.basic_salary + payroll.allowance.TOTAL - payroll.deduction.TOTAL],
        ["Payment Date", formatDate(payroll.payment_date)],

    ],
  })

  // Footer
  doc.text("This is a system-generated payslip.", 14, doc.internal.pageSize.height - 20)

  doc.save(`Payslip_${payroll.employee_id.full_name}.pdf`)
}
