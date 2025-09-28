"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, Building2, Download } from "lucide-react"
import type { PayrollEmployee } from "@/types/payroll"
import { Link } from "react-router-dom"
import { usePayrolls } from "@/hooks/usePayroll"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { exportPayrollToExcel } from "@/utils/export"
import PaginationComponent from "@/components/common/Pagination"
import { PayrollForm } from "./modals/add-payroll-modal"


// interface PayrollListProps {
//   payrolls: PayrollEmployee[]
// }

export function PayrollList() {
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEntriesPerPageChange = (value: string) => {
    setEntriesPerPage(value);
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }
  const { data: payrolls = [], isLoading: loading } = usePayrolls();

  const filteredPayrolls = payrolls.filter((payroll: PayrollEmployee) => {
    return payroll.employee_id.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employee_id.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.payment_date.toLowerCase().includes(searchTerm.toLowerCase());
  });
  console.log(payrolls);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateNetSalary = (payroll: PayrollEmployee) => {
    return payroll.basic_salary + payroll.allowance.TOTAL - payroll.deduction.TOTAL
  }

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(
      filteredPayrolls.length / Number.parseInt(entriesPerPage)
    );
    const startIndex = (currentPage - 1) * Number.parseInt(entriesPerPage);
    const endIndex = startIndex + Number.parseInt(entriesPerPage);
    const currentPayrolls = filteredPayrolls.slice(startIndex, endIndex);
    
    return { totalPages, currentPayrolls };
  }, [filteredPayrolls, entriesPerPage, currentPage]);

  const { totalPages, currentPayrolls } = paginationData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  function PayrollLoadingSkeleton() {
    return (
      <div className="grid gap-4 px-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-none px-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <Skeleton className="h-5 w-40 rounded-md" />
                      <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="h-4 w-20 rounded-md" />
                        <Skeleton className="h-4 w-28 rounded-md" />
                      </div>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                  </div>
  
                  <div className="flex items-center gap-4 mt-4">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                </div>
  
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 mx-auto w-full">

      <h1 className="text-2xl text-primary font-title pt-8 mb-10 px-6">
        Payroll
      </h1>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={entriesPerPage} onValueChange={handleEntriesPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportPayrollToExcel(filteredPayrolls)}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button
          className="bg-primary hover:bg-primary text-primary-foreground cursor-pointer w-auto sm:w-auto flex items-center justify-center gap-2"
          onClick={() => setIsModalOpen(true)}
          >
          Add Payroll
        </Button>
        </div>

      </div>
      {loading && <PayrollLoadingSkeleton />}
      {/* {error && <div>Error: {error.message}</div>} */}
      <div className="hidden lg:grid gap-4 px-6">
        {currentPayrolls?.map((payroll) => (
          <Card key={payroll.id} className="shadow-none px-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{payroll.employee_id.full_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{payroll.department.name}</span>
                        {payroll.department.manager_name !== "Not Assiged" && (
                          <span>• Manager: {payroll.department.manager_name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Basic Salary</p>
                      <p className="font-semibold">{formatCurrency(payroll.basic_salary)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Allowances</p>
                      <p className="font-semibold text-green-600">+{formatCurrency(payroll.allowance.TOTAL)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Deductions</p>
                      <p className="font-semibold text-red-600">-{formatCurrency(payroll.deduction.TOTAL)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Net Salary</p>
                      <p className="font-bold text-lg">{formatCurrency(calculateNetSalary(payroll))}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Payment Date: {formatDate(payroll.payment_date)}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Tax Rate: {payroll.deduction.TAX.rate}%
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link to={`/hr/payroll/${payroll.id}`}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:hidden grid gap-4 px-6">
        {currentPayrolls?.map((payroll) => (
          <Card key={payroll.id} className="shadow-none px-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left section */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{payroll.employee_id.full_name}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{payroll.department.name}</span>
                        {payroll.department.manager_name !== "Not Assiged" && (
                          <span>• Manager: {payroll.department.manager_name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Salary Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Basic Salary</p>
                      <p className="font-semibold">{formatCurrency(payroll.basic_salary)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Allowances</p>
                      <p className="font-semibold text-green-600">+{formatCurrency(payroll.allowance.TOTAL)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Deductions</p>
                      <p className="font-semibold text-red-600">-{formatCurrency(payroll.deduction.TOTAL)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Net Salary</p>
                      <p className="font-bold text-lg">{formatCurrency(calculateNetSalary(payroll))}</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Payment Date: {formatDate(payroll.payment_date)}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Tax Rate: {payroll.deduction.TAX.rate}%
                    </Badge>
                  </div>
                </div>

                {/* Right section: View button */}
                <div className="flex flex-col md:flex-shrink-0 gap-2">
                  <Link to={`/hr/payroll/${payroll.id}`}>
                    <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      <PaginationComponent 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange}
        className="mt-10 mb-10"
      />
      <PayrollForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
