"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const payrollData = [
  { month: "Jan", amount: 2200000, overtime: 35000 },
  { month: "Feb", amount: 2350000, overtime: 42000 },
  { month: "Mar", amount: 2180000, overtime: 28000 },
  { month: "Apr", amount: 2420000, overtime: 48000 },
  { month: "May", amount: 2380000, overtime: 45000 },
  { month: "Jun", amount: 2400000, overtime: 45000 },
]

export function PayrollChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Payroll Overview</CardTitle>
        <CardDescription>Total payroll and overtime costs by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={payrollData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
            <YAxis
              className="text-xs fill-muted-foreground"
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid white",
                borderRadius: "6px",
              }}
              formatter={(value: number, name: string) => [
                `$${(value / 1000).toFixed(0)}K`,
                name === "amount" ? "Base Payroll" : "Overtime",
              ]}
            />
            <Bar dataKey="amount" fill="#343a40" name="amount" radius={[0, 0, 4, 4]} />
            <Bar dataKey="overtime" fill="#343a40" name="overtime" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
