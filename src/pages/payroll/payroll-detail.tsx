/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PayrollDetailsSkeleton } from "@/components/loading-ui/payroll-detail-loading"
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { usePayroll } from "@/hooks/usePayroll"
import { generatePayslip } from "@/utils/pdf-export"

export function PayrollDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {data: payroll, isLoading: loading, error} = usePayroll(id || '')

    if (loading) {
        return <PayrollDetailsSkeleton />
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    if (!payroll) {
        return <div>Payroll not found</div>
    }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateNetSalary = () => {
    return payroll.basic_salary + payroll.allowance.TOTAL - payroll.deduction.TOTAL
  }

  const calculatePensionAmount = () => {
    return (payroll.basic_salary * payroll.deduction.PENSION.percentage) / 100
  }

  return (
    <div className="space-y-6 px-6 pt-8 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        {/* Left section: Back button + Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Button variant="ghost" onClick={() => navigate("/hr/payroll")}>
                <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-col">
                <h1 className="text-2xl text-primary font-title">Payroll Details</h1>
                <p className="text-muted-foreground text-sm">
                    ( Detailed payroll information for {payroll?.employee_id.full_name} )
                </p>
            </div>
        </div>

        {/* Right section: Action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {/* Uncomment if you want Excel export */}
            {/* <Button variant="outline" onClick={() => exportPayrollToExcel([payroll])}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
            </Button> */}

            <Button
            onClick={() => generatePayslip(payroll)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto flex items-center justify-center gap-2"
            >
            <FileText className="h-4 w-4" />
            Generate Payslip
            </Button>
        </div>
        </div>


      <div className="grid gap-6 lg:grid-cols-3">
        {/* Employee Information */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">{payroll?.employee_id.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <p className="font-mono text-sm">{payroll.employee_id.id}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="font-semibold">{payroll.department.name}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manager</p>
              <p className="font-semibold">
                {payroll.department.manager_name === "Not Assiged" ? "Not Assigned" : payroll.department.manager_name}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Payment Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{formatDate(payroll.payment_date)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Breakdown */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Salary Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Basic Salary</span>
                <span className="font-semibold">{formatCurrency(payroll.basic_salary)}</span>
              </div>

              <div className="flex justify-between items-center text-green-600">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Total Allowances</span>
                </div>
                <span className="font-semibold">+{formatCurrency(payroll.allowance.TOTAL)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-red-600">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">Total Deductions</span>
                </div>
                <span className="font-semibold">-{formatCurrency(payroll.deduction.TOTAL)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Net Salary:</span>
                <span className="text-primary">{formatCurrency(calculateNetSalary())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Tax & Deductions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Income Tax</span>
                  <Badge variant="secondary">{payroll.deduction.TAX.rate}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{payroll.deduction.TAX.name}</p>
                <p className="font-semibold text-red-600">-{formatCurrency(payroll.deduction.TAX.deduction)}</p>
                <p className="text-xs text-muted-foreground">
                  Min Salary: {formatCurrency(payroll.deduction.TAX.min_salary)}
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Pension Contribution</span>
                  <Badge variant="secondary">{payroll.deduction.PENSION.percentage}%</Badge>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(calculatePensionAmount())}</p>
                <p className="text-xs text-muted-foreground">{payroll.deduction.PENSION.percentage}% of basic salary</p>
              </div>

              {payroll.deduction.OTHER.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium">Other Deductions</span>
                    <div className="mt-2 space-y-1">
                      {payroll.deduction.OTHER.map((deduction: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{deduction.name}</span>
                          <span className="text-red-600">-{formatCurrency(deduction.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{formatCurrency(payroll.basic_salary)}</p>
              <p className="text-sm text-muted-foreground">Basic Salary</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(payroll.allowance.TOTAL)}</p>
              <p className="text-sm text-muted-foreground">Allowances</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(payroll.deduction.TOTAL)}</p>
              <p className="text-sm text-muted-foreground">Deductions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{formatCurrency(calculateNetSalary())}</p>
              <p className="text-sm text-muted-foreground">Net Salary</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
