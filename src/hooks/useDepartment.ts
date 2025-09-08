import { departmentService } from "@/service/departmentService";
import type { Department, createDepartment, updateDepartment } from "@/types/department";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";


export function useDepartment() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching departments from API...");
            const response = await departmentService.getAll();
            console.log("Departments fetched successfully:", response);
            setDepartments(response);
        } catch (error) {
            console.error("Error fetching departments:", error);
            let errorMessage = 'Failed to fetch departments';
            
            if (error instanceof Error) {
                errorMessage = error.message;
                // Handle specific validation errors
                if (error.message.includes('validation errors')) {
                    errorMessage = 'API returned invalid data format. Please check the backend response.';
                }
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDepartments();
    }, [getDepartments]);   

    const createDepartment = async (data: createDepartment) => {
        setCreating(true);
        setError(null);
        try {
            console.log("Creating department with data:", data);
            const response = await departmentService.create(data);
            console.log("Department created successfully:", response);
            toast.success("Department created successfully");
            // Instead of adding to the list, refetch all departments to ensure consistency
            // await getDepartments();
            setDepartments((prev) => {
                const updated = [...prev, response];
                return updated;
            });
        } catch (error) {
            console.error("Error creating department:", error);
            let errorMessage = 'Failed to create department';
            
            if (error instanceof Error) {
                errorMessage = error.message;
                // Handle specific validation errors
                if (error.message.includes('validation errors')) {
                    errorMessage = 'API returned invalid data format. Please check the backend response.';
                } else if (error.message.includes('manager_id')) {
                    errorMessage = 'Invalid manager selection. Please try again.';
                }
            }
            
            setError(errorMessage);
        } finally {
            setCreating(false);
        }
    }

    const updateDepartment = async (data: updateDepartment) => {
        setUpdating(true);
        setError(null);
        try {
            console.log("🔄 Updating department with data:", data);
            const response = await departmentService.update(data.id, data);
            console.log("✅ Department updated successfully:", response);
            toast.success("Department updated successfully");
            setDepartments((prev) => 
                prev.map(dept => dept.id === data.id ? response : dept)
            );
        } catch (error) {
            console.error("❌ Error updating department:", error);
            let errorMessage = 'Failed to update department';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            throw error; // Re-throw to let the modal handle it
        } finally {
            setUpdating(false);
        }
    };

    const deleteDepartment = async (id: string) => {
        setDeleting(true);
        setError(null);
        try {
            console.log("🔄 Deleting department with id:", id);
            await departmentService.delete(id);
            console.log("✅ Department deleted successfully");
            toast.success("Department deleted successfully");
            setDepartments((prev) => prev.filter(dept => dept.id !== id));
        } catch (error) {
            console.error("❌ Error deleting department:", error);
            let errorMessage = 'Failed to delete department';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            throw error; // Re-throw to let the modal handle it
        } finally {
            setDeleting(false);
        }
    };

    return { 
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
    };
}