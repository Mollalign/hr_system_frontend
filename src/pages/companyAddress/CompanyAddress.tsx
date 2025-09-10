import React, { useState, useMemo, useEffect } from 'react';
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
import { AddCompanyModal } from './modals/add-company-modal';
import { EditCompanyModal } from './modals/edit-company-modal';
import { DeleteCompanyModal } from './modals/delete-company-modal';
import { useCompanyAddress } from '@/hooks/useCompanyAddress';
import type { CompanyAddress, CreateCompanyAddressRequest, UpdateCompanyAddressRequest } from '@/types/companyAddress';
import { DataLoading } from '@/components/layouts/data-loading';
import { toast } from 'sonner';
import { companyAddressService } from '@/service/companyAddressService';

const CompanyAddressList: React.FC = () => {
  const { companyAddresses, loading, error, getCompanyAddresses } = useCompanyAddress();
  const [companies, setCompanies] = useState<CompanyAddress[]>(companyAddresses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingCompany, setEditingCompany] = useState<CompanyAddress | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<CompanyAddress | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Keep companies in sync with hook state
  useEffect(() => {
    if (companyAddresses) {
      setCompanies(companyAddresses);
    }
  }, [companyAddresses]);

  // Filtering
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (!company || typeof company !== 'object') return false;

      const name = company.branch_name || '';
      const phone = company.branch_phone || '';
      const email = company.branch_email || '';
      const address = company.branch_address || '';

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [companies, searchTerm]);

  // Pagination / show entries
  const displayedCompanies = useMemo(() => {
    if (selectedElement === "all") return filteredCompanies;
    return filteredCompanies.slice(0, Number(selectedElement));
  }, [filteredCompanies, selectedElement]);

  // Add company
  const handleAddCompany = async (newCompany: CreateCompanyAddressRequest) => {
    setIsCreating(true);
    try {
      const createdCompany = await companyAddressService.create(newCompany);
      const companyToAdd = Array.isArray(createdCompany) ? createdCompany[0] : createdCompany;
      setCompanies((prev) => [...prev, companyToAdd]);
      toast.success("Company branch added successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error adding company");
    } finally {
      setIsCreating(false);
    }
  };

  // Update company
  const handleUpdateCompany = async (updatedCompany: UpdateCompanyAddressRequest) => {
    setIsUpdating(true);
    try {
      const response = await companyAddressService.update(updatedCompany.id, updatedCompany);
      const updatedCompanyData = Array.isArray(response) ? response[0] : response;
      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompanyData : c))
      );
      toast.success("Company branch updated successfully");
      setIsEditModalOpen(false);
      setEditingCompany(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating company");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete company
  const handleDeleteCompany = async (companyId: string) => {
    setIsDeleting(true);
    try {
      const response = await companyAddressService.delete(companyId);
      if (response.success) {
        setCompanies((prev) => prev.filter((c) => c.id !== companyId));
        toast.success("Company branch deleted successfully");
        setIsDeleteModalOpen(false);
        setDeletingCompany(null);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Error deleting company");
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="px-6 w-full">
        <DataLoading />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="px-6 w-full">
        <h1 className="text-2xl font-title text-foreground pt-8 mb-10">Company</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive mb-2">Error loading companies</div>
            <div className="text-muted-foreground text-sm mb-4">{error}</div>
            <Button onClick={getCompanyAddresses} variant="outline">
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
        Company
      </h1>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          {/* Show entries */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select defaultValue="all" onValueChange={(value) => setSelectedElement(value)}>
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

          {/* Search */}
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
          Add Company
        </Button>
        <AddCompanyModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onAdd={handleAddCompany}
          isLoading={isCreating}
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block rounded-lg border bg-card mb-10">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted hover:bg-muted">
              <TableHead className="px-6 py-4">Branch Name</TableHead>
              <TableHead className="px-6 py-4">Phone</TableHead>
              <TableHead className="px-6 py-4">Email</TableHead>
              <TableHead className="px-6 py-4">Address</TableHead>
              <TableHead className="px-6 py-4">Status</TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCompanies.length > 0 ? (
              displayedCompanies.map((company, index) => (
                <TableRow key={company.id || `company-${index}`} className="border-b last:border-b-0">
                  <TableCell className="px-6 py-5">{company.branch_name}</TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">{company.branch_phone}</TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">{company.branch_email}</TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">{company.branch_address}</TableCell>
                  <TableCell className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      company.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${company.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
                      {company.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                        onClick={() => {
                          setEditingCompany(company);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80"
                        onClick={() => {
                          setDeletingCompany(company);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 sm:hidden">
        {displayedCompanies.length > 0 ? (
          displayedCompanies.map((company, index) => (
            <div
              key={company.id || `company-${index}`}
              className="p-4 rounded-xl border bg-card shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{company.branch_name}</h2>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    company.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${company.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
                  {company.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Phone: {company.branch_phone}</p>
              <p className="text-sm text-muted-foreground">Email: {company.branch_email}</p>
              <p className="text-sm text-muted-foreground">Address: {company.branch_address}</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingCompany(company); setIsEditModalOpen(true); }}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { setDeletingCompany(company); setIsDeleteModalOpen(true); }}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">No results found.</div>
        )}
      </div>

      {/* Modals */}
      <EditCompanyModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        company={editingCompany}
        onUpdate={handleUpdateCompany}
        isLoading={isUpdating}
      />
      <DeleteCompanyModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        company={deletingCompany}
        onDelete={(id) => handleDeleteCompany(id)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CompanyAddressList;
