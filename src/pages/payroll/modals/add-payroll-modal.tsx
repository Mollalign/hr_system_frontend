"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Users, User, DollarSign } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEmployeeActive } from "@/hooks/useEmployee"
import { useCreatePayroll, useCreatePayrollByEmployeeId } from "@/hooks/usePayroll"
import type{ PayrollEmployee } from "@/types/payroll"

interface PayrollFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface PayrollFormData {
  paymentDate: string
  employeeId?: string
  payrollType: "single" | "all"
}

export function PayrollForm( { isOpen, onOpenChange }: PayrollFormProps ) {
  const [formData, setFormData] = useState<PayrollFormData>({
    paymentDate: new Date().toISOString().split("T")[0],
    payrollType: "all",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { data: employees } = useEmployeeActive()
  console.log("Active employees", employees)
  const { mutate: createPayroll } = useCreatePayroll()
  const { mutate: createPayrollByEmployeeId } = useCreatePayrollByEmployeeId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare request body based on payroll type
      const requestBody = {
        payment_date: new Date(formData.paymentDate).toISOString(),
        ...(formData.payrollType === "single" &&
          formData.employeeId && {
            employee_id: formData.employeeId,
          }),
      }

      // Determine API endpoint based on payroll type
      const endpoint = formData.payrollType === "single" ? "/api/payroll/employee" : "/api/payroll"

      console.log("Submitting payroll:", {
        endpoint,
        requestBody,
        payrollType: formData.payrollType,
      })

      if (formData.payrollType === "single") {
        createPayrollByEmployeeId({ employeeId: requestBody.employee_id as string, payroll: requestBody as unknown as PayrollEmployee })
      } else {
        createPayroll(requestBody as unknown as PayrollEmployee)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))


      // Reset form
      setFormData({
        paymentDate: new Date().toISOString().split("T")[0],
        payrollType: "all",
      })

      onOpenChange(false)
    } catch (error) {
      toast.error("Error Creating Payroll")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
      <DialogHeader className="text-center">
        <DialogTitle className="flex gap-2 text-2xl">
          Add Payroll
        </DialogTitle>
        <DialogDescription>Choose to create payroll for a single employee or all employees</DialogDescription>
      </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Date */}
          <div className="space-y-2">
            <Label htmlFor="paymentDate" className="text-sm font-medium">
              Payment Date
            </Label>
            <div className="relative">
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentDate: e.target.value }))}
                className="pl-10"
                required
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Payroll Type Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Payroll Type</Label>
            <RadioGroup
              value={formData.payrollType}
              onValueChange={(value: "single" | "all") =>
                setFormData((prev) => ({
                  ...prev,
                  payrollType: value,
                  employeeId: value === "all" ? undefined : prev.employeeId,
                }))
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">All Employees</div>
                    <div className="text-sm text-muted-foreground">Process payroll for everyone</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex items-center gap-2 cursor-pointer flex-1">
                  <User className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Single Employee</div>
                    <div className="text-sm text-muted-foreground">Process for one employee</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Employee Selection (only shown for single employee) */}
          {formData.payrollType === "single" && (
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-medium">
                Select Employee
              </Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.full_name}</span>
                        {/* <span className="text-sm text-muted-foreground">{employee.department.name}</span> */}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Summary Card */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span className="font-medium">{new Date(formData.paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payroll Type:</span>
                  <span className="font-medium capitalize">
                    {formData.payrollType === "single" ? "Single Employee" : "All Employees"}
                  </span>
                </div>
                {formData.payrollType === "single" && formData.employeeId && (
                <>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Employee:</span>
                        <span className="font-medium">
                        {employees?.find((emp) => emp.id === formData.employeeId)?.full_name}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">
                            {employees?.find((emp) => emp.id === formData.employeeId)?.department.name}
                        </span>
                    </div>
                </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || (formData.payrollType === "single" && !formData.employeeId)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {formData.payrollType === "single" ? "Create Employee Payroll" : "Create All Payroll"}
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
