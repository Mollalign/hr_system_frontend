"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plus, Building, MapPinHouse, Activity } from "lucide-react"
import { AttendanceChart } from "./components/attendance-chart"
import { PayrollChart } from "./components/payroll-chart"
import { DepartmentOverview } from "./components/department-overview"

export function HRDashboard() {
  return (
    <div className="flex min-h-screen bg-background rounded-lg">
      <main className="flex-1 p-8 lg:p-8">
        <div className="max-w-9xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your workforce efficiently</p>
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="sm:max-h-[140px]">
                    <CardHeader className=" flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">1,200</div>
                        {/* <p className="text-xs text-muted-foreground">+2.1% from yesterday</p> */}
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-800">
                                {/* <Plus className="w-4 h-4 text-white" /> */}
                                500
                            </Badge>
                            <p className="text-xs text-muted-foreground">Active employees</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="sm:max-h-[140px]">
                    <CardHeader className=" flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Departments</CardTitle>
                    <Building className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-800">
                            {/* <Plus className="w-4 h-4 text-white" /> */}
                            12
                        </Badge>
                        <p className="text-xs text-muted-foreground">Active departments</p>
                    </div>
                    </CardContent>
                </Card>

                <Card className="sm:max-h-[140px]">
                    <CardHeader className=" flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Company Branches</CardTitle>
                    <MapPinHouse className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold text-primary">8</div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-800">
                            {/* <Plus className="w-4 h-4 text-white" /> */}
                            8
                        </Badge>
                        <p className="text-xs text-muted-foreground">Active branches</p>
                    </div>
                    </CardContent>
                </Card>
                <Card className="sm:max-h-[140px]">
                    <CardHeader className=" flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <Activity className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold text-primary">98.5%</div>
                    {/* <p className="text-xs text-muted-foreground">+2.1% from yesterday</p> */}
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-800">
                            {/* <Plus className="w-4 h-4 text-white" /> */}
                            98.5%
                        </Badge>
                        <p className="text-xs text-muted-foreground">this month</p>
                    </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                <AttendanceChart />
                <PayrollChart />
            </div>
            <DepartmentOverview />

        </div>
      </main>
    </div>
  )
}
