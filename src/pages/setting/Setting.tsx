"use client";
import { useState } from "react";
import {
  Building2,
  CreditCard,
  CalendarDays,
  Users,
  Bell,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "payroll", label: "Payroll", icon: CreditCard },
  { id: "leave", label: "Leave", icon: CalendarDays },
  { id: "employees", label: "Employees", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const Setting = () => {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        ⚙️ HR System Settings
      </h1>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl shadow-sm transition-all text-sm sm:text-base
              ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white hover:bg-gray-50 text-gray-700 border"
              }`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl capitalize">
            {tabs.find((t) => t.id === activeTab)?.label} Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeTab === "company" && (
            <div className="space-y-4">
              <label className="block">
                <span className="font-medium">Company Name</span>
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="mt-1 w-full rounded-xl border p-2"
                />
              </label>
              <label className="block">
                <span className="font-medium">Address</span>
                <input
                  type="text"
                  placeholder="Enter address"
                  className="mt-1 w-full rounded-xl border p-2"
                />
              </label>
              <Button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 rounded-xl">
                Save Changes
              </Button>
            </div>
          )}

          {activeTab === "payroll" && (
            <p className="text-gray-600">
              Configure salary structure, tax rules, and payroll cycle here.
            </p>
          )}

          {activeTab === "leave" && (
            <p className="text-gray-600">
              Define leave types, accrual rules, and holiday calendar.
            </p>
          )}

          {activeTab === "employees" && (
            <p className="text-gray-600">
              Manage employee defaults, probation period, and roles.
            </p>
          )}

          {activeTab === "notifications" && (
            <p className="text-gray-600">
              Customize email templates, reminders, and system alerts.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;
