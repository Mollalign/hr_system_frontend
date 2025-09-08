import { useState, useEffect } from "react";
import { companyAddressService } from "@/service/companyAddressService";
import type { CompanyAddress, CreateCompanyAddressRequest, UpdateCompanyAddressRequest } from "../types/companyAddress";


export function useCompanyAddress() {
    const [companyAddresses, setCompanyAddresses] = useState<CompanyAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCompanyAddresses();
    }, []);

    // Get all company addresses
    const getCompanyAddresses = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await companyAddressService.getAll();
            setCompanyAddresses(response);
        } catch (error) {
            console.error("❌ Error fetching company addresses:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch company addresses';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Create a new company address
    const createCompanyAddress = async (data: CreateCompanyAddressRequest) => {
        setLoading(true);
        setError(null);

        try {
            const newCompanyAddress = await companyAddressService.create(data);
            setCompanyAddresses((prev) => {
                const updated = [...prev, newCompanyAddress];
                return updated;
            });
        } catch (error) {
            console.error("❌ Error creating company address:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create company address';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Update a company address
    const updateCompanyAddress = async (id: string, data: UpdateCompanyAddressRequest) => {

        setLoading(true);

        try {
            const updatedCompanyAddress = await companyAddressService.update(id, data);
            setCompanyAddresses((prev) => prev.map((companyAddress) => companyAddress.id === id ? updatedCompanyAddress : companyAddress));

        } catch (error) {
            console.error("❌ Error creating company address:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create company address';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete a company address
    const deleteCompanyAddress = async (id: string) => {
        
        setLoading(true);

        try {
            await companyAddressService.delete(id);
            setCompanyAddresses((prev) => prev.filter((companyAddress) => companyAddress.id !== id));
        } catch (error) {
            console.error("❌ Error creating company address:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create company address';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
return {
    companyAddresses,
    loading,
    error,
    getCompanyAddresses,
    createCompanyAddress,
    updateCompanyAddress,
    deleteCompanyAddress
}
};
