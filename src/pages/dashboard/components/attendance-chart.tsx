"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const attendanceData = [
  { day: "Mon", present: 95, absent: 5 },
  { day: "Tue", present: 92, absent: 8 },
  { day: "Wed", present: 96, absent: 4 },
  { day: "Thu", present: 94, absent: 6 },
  { day: "Fri", present: 89, absent: 11 },
  { day: "Sat", present: 78, absent: 22 },
  { day: "Sun", present: 45, absent: 55 },
]

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance Trend</CardTitle>
        <CardDescription>Employee attendance rates over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} name="Present %" />
            <Line type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={2} name="Absent %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
