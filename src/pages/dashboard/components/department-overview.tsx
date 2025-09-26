import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Building2 } from "lucide-react"

interface DepartmentOverviewProps {
  detailed?: boolean
}

const departments = [
  {
    name: "Engineering",
    employees: 245,
    budget: 2800000,
    utilization: 92,
    growth: "+8%",
    manager: "John Smith",
  },
  {
    name: "Marketing",
    employees: 67,
    budget: 850000,
    utilization: 88,
    growth: "+12%",
    manager: "Sarah Wilson",
  },
  {
    name: "Sales",
    employees: 134,
    budget: 1200000,
    utilization: 95,
    growth: "+15%",
    manager: "Mike Johnson",
  },
  {
    name: "HR",
    employees: 23,
    budget: 450000,
    utilization: 85,
    growth: "+3%",
    manager: "Emily Davis",
  },
  {
    name: "Finance",
    employees: 45,
    budget: 680000,
    utilization: 90,
    growth: "+5%",
    manager: "Robert Chen",
  },
  {
    name: "Operations",
    employees: 89,
    budget: 920000,
    utilization: 87,
    growth: "+7%",
    manager: "Lisa Anderson",
  },
]

export function DepartmentOverview({ detailed = false }: DepartmentOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Department Overview
        </CardTitle>
        <CardDescription>
          {detailed ? "Detailed department metrics and performance" : "Key metrics across all departments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${detailed ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          {departments.map((dept) => (
            <div key={dept.name} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{dept.name}</h4>
                  {detailed && <p className="text-sm text-muted-foreground">Manager: {dept.manager}</p>}
                </div>
                <Badge variant="outline" className="text-xs">
                  {dept.growth}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employees</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {dept.employees}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Budget</p>
                  <p className="font-medium">${(dept.budget / 1000000).toFixed(1)}M</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-medium">{dept.utilization}%</span>
                </div>
                <Progress value={dept.utilization} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
