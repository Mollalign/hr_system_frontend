import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Search, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDepartment } from '@/hooks/useDepartment';
import { DataLoading } from '@/components/layouts/data-loading';
import AddDepartmentModal  from './modals/add-department-modal';
import  EditDepartmentModal from './modals/edit-department-modal';
import  DeleteDepartmentModal  from './modals/delete-department-modal';
import type { Department, updateDepartment } from '@/types/department';

const Department: React.FC = () => {
  const { 
    departments, 
    loading, 
    creating, 
    updating, 
    deleting, 
    error, 
    getDepartments, 
    createDepartment, 
    updateDepartment, 
    deleteDepartment 
  } = useDepartment();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  const [selectedElement, setSelectedElement] = useState("all"); 

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setIsEditModalOpen(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setDeletingDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateDepartment = async (updatedDepartment: updateDepartment) => {
    try {
      await updateDepartment(updatedDepartment);
      setIsEditModalOpen(false);
      setEditingDepartment(null);
    } catch (error) {
      // Error is handled in the hook and modal
      console.log(error)
    }
  };

  const handleDeleteConfirm = async (departmentId: string) => {
    try {
      await deleteDepartment(departmentId);
      setIsDeleteModalOpen(false);
      setDeletingDepartment(null);
    } catch (error) {
      // Error is handled in the hook and modal
      console.log(error)
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) => {
        //safety checks
        if (!dept || typeof dept !== 'object') return false;
        const name = dept.name || '';
        const manager = dept.manager_name || '';
        const status = dept.is_active ? 'active' : 'inactive';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
               status.toLowerCase() === searchTerm.toLowerCase()
      }
    );
  }, [departments, searchTerm]);


  const displayedDepartments = useMemo(() => {
    if (selectedElement === "all") return filteredDepartments;
    return filteredDepartments.slice(0, Number(selectedElement));
  }, [filteredDepartments, selectedElement]);


  // Show loading state
  if (loading) {
    return (
      <div className="px-6 w-full">
        <DataLoading />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="px-6 w-full">
        <h1 className="text-2xl font-title text-foreground pt-8 mb-10">
          Department
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive mb-2">Error loading departments</div>
            <div className="text-muted-foreground text-sm mb-4">{error}</div>
            <Button onClick={getDepartments} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="px-4 sm:px-6 w-full">
    <h1 className="text-2xl font-title text-foreground pt-6 sm:pt-8 mb-6 sm:mb-10">
      Department
    </h1>

    {/* Top Controls */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
        {/* Show entries */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select 
            defaultValue="all"
            onValueChange={(value) => setSelectedElement(value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 h-10 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary hover:bg-primary/80 text-white w-full sm:w-auto"
      >
        Add Department
      </Button>
      <AddDepartmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={createDepartment}
        loading={creating}
      />
    </div>

    {/* Desktop Table View */}
    <div className="hidden sm:block rounded-lg border bg-card mb-10">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted hover:bg-muted">
            <TableHead className="px-6 py-4 font-title text-foreground">Department</TableHead>
            <TableHead className="px-6 py-4 font-title text-foreground">Manager</TableHead>
            <TableHead className="px-6 py-4 font-title text-foreground">Status</TableHead>
            <TableHead className="px-6 py-4 font-title text-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedDepartments.length > 0 ? (
            displayedDepartments.map((dept, index) => (
              <TableRow key={dept.id || `dept-${index}`} className="border-b last:border-b-0">
                <TableCell className="px-6 py-5 font-title text-foreground">{dept.name}</TableCell>
                <TableCell className="px-6 py-5 text-muted-foreground">
                  {dept.manager_name ? dept.manager_name : 'Not Assigned'}
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      dept.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        dept.is_active ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></div>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                      onClick={() => handleEditDepartment(dept)}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                      onClick={() => handleDeleteDepartment(dept)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-48 text-muted-foreground">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* Mobile Card View */}
    <div className="grid gap-4 sm:hidden">
      {displayedDepartments.length > 0 ? (
        displayedDepartments.map((dept, index) => (
          <div
            key={dept.id || `dept-${index}`}
            className="p-4 rounded-xl border bg-card shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{dept.name}</h2>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  dept.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    dept.is_active ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></div>
                {dept.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Manager: {dept.manager_name ? dept.manager_name : 'Not Assigned'}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditDepartment(dept)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteDepartment(dept)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-10">
          No results found.
        </div>
      )}
    </div>
    <EditDepartmentModal 
      open={isEditModalOpen} 
      onOpenChange={setIsEditModalOpen}
      department={editingDepartment}
      onUpdate={handleUpdateDepartment}
      isLoading={updating}
    />
    <DeleteDepartmentModal
      open={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
      department={deletingDepartment}
      onDelete={handleDeleteConfirm}
      isLoading={deleting}
    />
  </div>
)

}

export default Department