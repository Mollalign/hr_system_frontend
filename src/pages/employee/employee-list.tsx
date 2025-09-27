"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowRight, Trash2, Plus } from "lucide-react";
import { CreateEmployeeModal } from "./modals/add-employee-modal";
import { useEmployees, useDeleteEmployee } from "@/hooks/useEmployee";
import type { Employee } from "@/types/employee";
import { DeleteEmployeeModal } from "./modals/delete-employee-modal";
import PaginationComponent from "@/components/common/Pagination";
import TableSkeleton from "@/components/loading-ui/table-skeleton";

// Memoized table row
const EmployeeTableRow = memo(
  ({
    employee,
    onEmployeeClick,
    onEmployeeDelete,
  }: {
    employee: Employee;
    onEmployeeClick: (id: string) => void;
    onEmployeeDelete: (id: string) => void;
  }) => (
    <TableRow className="h-16 border-l border-r hover:bg-muted/30 transition-colors">
      <TableCell className="font-semibold pl-4 sm:pl-8 border-r text-[#333]">
        {employee.full_name}
      </TableCell>
      <TableCell className="hidden md:table-cell border-r text-[#6E6E6E]">
        {employee.email}
      </TableCell>
      <TableCell className="hidden md:table-cell border-r text-[#6E6E6E]">
        {employee.phone_number}
      </TableCell>
      <TableCell className="border-r text-[#6E6E6E]">
        {employee.job_title}
      </TableCell>
      <TableCell className="hidden sm:table-cell border-r text-[#6E6E6E]">
        {employee.department.name}
      </TableCell>
      <TableCell className="border-r">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            employee.is_active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              employee.is_active ? "bg-green-500" : "bg-gray-500"
            }`}
          ></div>
          {employee.is_active ? "Active" : "Inactive"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-muted hover:bg-muted/70"
            onClick={() => onEmployeeClick(employee.id)}
          >
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-muted hover:bg-muted/70"
            onClick={() => onEmployeeDelete(employee.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
);

EmployeeTableRow.displayName = "EmployeeTableRow";

export default function EmployeePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const { data: employees = [], isLoading: loading, error } = useEmployees();
  const router = useNavigate();
  const { mutate: deleteEmployeeMutate, isPending: isDeleting } =
    useDeleteEmployee();

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(
      filteredEmployees.length / Number.parseInt(entriesPerPage)
    );
    const startIndex = (currentPage - 1) * Number.parseInt(entriesPerPage);
    const endIndex = startIndex + Number.parseInt(entriesPerPage);
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    return { totalPages, currentEmployees };
  }, [filteredEmployees, entriesPerPage, currentPage]);

  const { totalPages, currentEmployees } = paginationData;

  // Handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleEntriesPerPageChange = useCallback((value: string) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleEmployeeClick = useCallback(
    (employeeId: string) => {
      router(`/employee/${employeeId}`);
    },
    [router]
  );

  const handleDeleteEmployee = useCallback(
    (employeeId: string) => {
      const employeeToDelete = employees.find((emp) => emp.id === employeeId);
      setDeletingEmployee(employeeToDelete || null);
      setIsDeleteModalOpen(true);
    },
    [employees]
  );

  const handleConfirmDelete = useCallback(
    (employeeId: string) => {
      deleteEmployeeMutate(employeeId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeletingEmployee(null);
        },
      });
    },
    [deleteEmployeeMutate]
  );

  // Loading + error states
  if (loading) return <TableSkeleton />;
  if (error)
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Employee</h2>
          <Button
            className="bg-primary hover:bg-primary/80 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Employee
          </Button>
        </div>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive font-medium">Error loading employees</p>
          <p className="text-destructive/80 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="mx-auto w-full px-4 sm:px-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-primary pt-6 mb-6">Employee</h1>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={entriesPerPage}
              onValueChange={handleEntriesPerPageChange}
            >
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

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <Button
          className="bg-primary hover:bg-primary/90 text-white shadow-md w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Employee
        </Button>
      </div>

      {/* Table wrapper with scroll for mobile */}
      <div className="border rounded-lg shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="pl-4 sm:pl-8">Full Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEmployees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                onEmployeeClick={handleEmployeeClick}
                onEmployeeDelete={handleDeleteEmployee}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-8 mb-10"
      />

      {/* Modals */}
      <CreateEmployeeModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      <DeleteEmployeeModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        employee={deletingEmployee}
        onDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
