"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, MapPinHouse, Activity } from "lucide-react";
import { AttendanceChart } from "./components/attendance-chart";
import { PayrollChart } from "./components/payroll-chart";
import { DepartmentOverview } from "./components/department-overview";

export function HRDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                HR Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your workforce efficiently
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Employees */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Employees
                </CardTitle>
                <Users className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">1,200</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700"
                  >
                    500
                  </Badge>
                  <p className="text-xs text-gray-500">Active employees</p>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Departments
                </CardTitle>
                <Building className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700"
                  >
                    12
                  </Badge>
                  <p className="text-xs text-gray-500">Active departments</p>
                </div>
              </CardContent>
            </Card>

            {/* Branches */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Company Branches
                </CardTitle>
                <MapPinHouse className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">8</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700"
                  >
                    8
                  </Badge>
                  <p className="text-xs text-gray-500">Active branches</p>
                </div>
              </CardContent>
            </Card>

            {/* Attendance */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Attendance Rate
                </CardTitle>
                <Activity className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">98.5%</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700"
                  >
                    98.5%
                  </Badge>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceChart />
            <PayrollChart />
          </div>

          {/* Department Overview */}
          <DepartmentOverview />
        </div>
      </main>
    </div>
  );
}
