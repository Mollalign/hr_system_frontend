"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Clock, User, MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CreateAttendanceRequest } from "@/types/attendace"
import { useEmployees } from "@/hooks/useEmployee"

// --- Validation schema ---
const formSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee is required." }),
  date: z.date({
    message: "A date is required.",
  }),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid check-in time (HH:MM).",
  }),
  status: z.enum(["Present", "Absent"], {
    message: "Status is required.",
  }),
})


type AttendanceFormInput = z.infer<typeof formSchema>

interface AddAttendanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (newAttendance: CreateAttendanceRequest) => Promise<void>
  loading: boolean
}

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ open, onOpenChange, onAdd, loading }) => {
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useEmployees()
  
  const form = useForm<AttendanceFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      date: new Date(),
      checkInTime: "08:00",
      status: "Present",
    },
  })

  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("")
  const [workingHours, setWorkingHours] = useState("00:00")
  const [selectedLocation, setSelectedLocation] = useState("")

  const filteredEmployees = useMemo(() => {
    if (!employeeSearchTerm) return employees
    return employees.filter((employee) => 
      employee.full_name.toLowerCase().includes(employeeSearchTerm.toLowerCase())
    )
  }, [employeeSearchTerm, employees])

  useEffect(() => {
    if (!open) {
      form.reset({
        employeeId: "",
        date: new Date(),
        checkInTime: "08:00",
        status: "Present",
      })
      setEmployeeSearchTerm("")
      setSelectedEmployeeName("")
      setSelectedLocation("")
      setWorkingHours("00:00")
      form.clearErrors()
    }
  }, [open, form])

  const onSubmit = async (values: AttendanceFormInput) => {
    const employee = employees.find((emp) => emp.id === values.employeeId)
    if (!employee) {
      form.setError("employeeId", { message: "Selected employee not found." })
      return
    }

    // --- Simple frontend working hours calculation (based only on check-in) ---
    const [h, m] = values.checkInTime.split(":").map(Number)
    const totalMinutes = h * 60 + m
    const workingHours = Math.floor(totalMinutes / 60)
    const workingMinutes = totalMinutes % 60
    setWorkingHours(`${String(workingHours).padStart(2, "0")}:${String(workingMinutes).padStart(2, "0")}`)

    setSelectedLocation(employee.work_location.branch_name)

    // --- Create proper time string in HH:MM:SS format for backend ---
    const [hours, minutes] = values.checkInTime.split(":").map(Number)
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
    
    // --- Request body for backend (matches your API format) ---
    const newAttendanceRequest: CreateAttendanceRequest = {
      employee_id: values.employeeId,
      check_in_time: timeString,
    }

    try {
      console.log("🔧 Submitting attendance form:", newAttendanceRequest);
      await onAdd(newAttendanceRequest);
      console.log("✅ Attendance created successfully");
    } catch (error) {
      console.error("❌ Error creating attendance:", error);
      form.setError("root", { message: "Failed to create attendance. Please try again." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Record Attendance
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new attendance entry for today or any specific date.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Employee
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        const emp = employees.find((e) => e.id === value)
                        setSelectedEmployeeName(emp ? emp.full_name : "")
                        setSelectedLocation(emp ? emp.work_location.branch_name : "")
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-card border-border hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Choose an employee">
                            {selectedEmployeeName || "Choose an employee"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        <div className="px-2 py-2 sticky top-0 bg-popover z-10 border-b">
                          <Input
                            placeholder="Search employees..."
                            className="h-9"
                            value={employeeSearchTerm}
                            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {employeesLoading ? (
                          <div className="p-3 text-sm text-muted-foreground text-center">Loading employees...</div>
                        ) : employeesError ? (
                          <div className="p-3 text-sm text-red-500 text-center">Error loading employees</div>
                        ) : filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id} className="py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{employee.full_name}</span>
                                <span className="text-xs text-muted-foreground">{employee.work_location.branch_name}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-muted-foreground text-center">No employees found.</div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 justify-start text-left font-normal bg-card border-border hover:border-primary/50 transition-colors",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "MMM dd") : <span>Pick date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="rounded-md border-0"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkInTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Check In
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="h-11 bg-card border-border hover:border-primary/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Status</FormLabel>
                    <FormControl>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant={field.value === "Present" ? "default" : "outline"}
                          className={cn(
                            "flex-1 h-11 transition-all",
                            field.value === "Present"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-card border-border hover:border-primary/50",
                          )}
                          onClick={() => field.onChange("Present")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Present
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "Absent" ? "default" : "outline"}
                          className={cn(
                            "flex-1 h-11 transition-all",
                            field.value === "Absent"
                              ? "bg-destructive text-destructive-foreground shadow-sm"
                              : "bg-card border-border hover:border-destructive/50",
                          )}
                          onClick={() => field.onChange("Absent")}
                        >
                          Absent
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {(selectedLocation || workingHours !== "00:00") && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  {selectedLocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Location:</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedLocation}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Working Hours:</span>
                    <Badge variant="outline" className="text-xs">
                      {workingHours}
                    </Badge>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all hover:shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording Attendance...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Record Attendance
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
