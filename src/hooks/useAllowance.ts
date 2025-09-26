import { allowanceService } from "@/service/allowanceService";
import type { Allowance, CreateAllowanceRequest, UpdateAllowanceRequest } from "@/types/allowance";
import { useState, useEffect } from "react";

export function useAllowance() {
    const [allowances, setAllowances] = useState<Allowance[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllowances();
    }, []);

    const getAllowances = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await allowanceService.getAll();
            setAllowances(response);
        } catch (error) {
            console.error("Error fetching allowances:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch allowances';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const createAllowance = async (data: CreateAllowanceRequest): Promise<void> => {
        setCreating(true);
        setError(null);

        try {
            const newAllowance = await allowanceService.create(data);
            setAllowances((prev) => [...prev, newAllowance]);
        } catch (error) {
            console.error("Error creating allowance:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create allowance';
            setError(errorMessage);
            throw error; // Re-throw to let the modal handle it
        } finally {
            setCreating(false);
        }
    }

    const updateAllowance = async (id: string, data: UpdateAllowanceRequest): Promise<void> => {
        setUpdating(true);
        setError(null);
        try {
            const updatedAllowance = await allowanceService.update(id, data);
            setAllowances((prev) => prev.map((allowance) => allowance.id === id ? updatedAllowance : allowance));
        } catch (error) {
            console.error("Error updating allowance:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update allowance';
            setError(errorMessage);
            throw error; // Re-throw to let the modal handle it
        } finally {
            setUpdating(false);
        }
    }

    const deleteAllowance = async (id: string): Promise<void> => {
        setDeleting(true);
        setError(null);
        try {
            await allowanceService.delete(id);
            setAllowances((prev) => prev.filter((allowance) => allowance.id !== id));
        } catch (error) {
            console.error("Error deleting allowance:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete allowance';
            setError(errorMessage);
            throw error; // Re-throw to let the modal handle it
        } finally {
            setDeleting(false);
        }
    }

    return { allowances, loading, creating, updating, deleting, error, getAllowances, createAllowance, updateAllowance, deleteAllowance };
}    