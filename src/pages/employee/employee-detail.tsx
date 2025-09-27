"use client"

import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Download, 
  Eye, 
  User, 
  Building
} from "lucide-react"
import { useEmployee, useUpdateEmployee } from "@/hooks/useEmployee"
import { DataLoading } from "@/components/layouts/data-loading";
import { useState, useEffect } from "react"
import type { UpdateEmployeeRequest } from "@/types/employee"
import {useCompanyAddress} from "@/hooks/useCompanyAddress"
import { useDepartment } from "@/hooks/useDepartment"


export default function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {data: employee, isLoading: loading, error} = useEmployee(id || '');
  const updateEmployeeMutation = useUpdateEmployee();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateEmployeeRequest | null>(null);
  const { companyAddresses } = useCompanyAddress()
  const { departments } = useDepartment()
  // Initialize form data when employee data is loaded
  useEffect(() => {
    if (employee) {
      console.log('Employee data loaded:', employee);
      setFormData({
        full_name: employee.full_name,
        first_name: employee.first_name,
        last_name: employee.last_name,
        gender: employee.gender,
        date_of_birth: employee.date_of_birth,
        maternal_status: employee.maternal_status,
        nationality: employee.nationality,
        email: employee.email,
        phone_number: employee.phone_number,
        alternative_phone_number: employee.alternative_phone_number,
        permanent_address: employee.permanent_address,
        current_address: employee.current_address,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        zip_code: employee.zip_code,
        contact_person_name: employee.contact_person_name,
        contact_person_relationship: employee.contact_person_relationship,
        contact_person_phone: employee.contact_person_phone,
        contact_person_alternative_phone: employee.contact_person_alternative_phone,
        contact_person_address: employee.contact_person_address,
        employee_code: employee.employee_code,
        job_title: employee.job_title,
        department: employee.department?.id || '',
        employee_type: employee.employee_type,
        employment_shift: employee.employment_shift,
        employment_status: employee.employment_status,
        hire_date: employee.hire_date,
        work_location: employee.work_location?.id || '',
        bank_account_number: employee.bank_account_number,
        basic_salary: employee.basic_salary,
        allowance: employee.allowance?.map(a => a.id) || [],
        effective_date: employee.effective_date,
        currency_of_salary: employee.currency_of_salary,
        cv_file: employee.cv_file,
        is_active: employee.is_active,
        deduction: employee.deduction?.map(d => d.id) || [],
      });
    }
  }, [employee]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original employee data
    if (employee) {
      setFormData({
        full_name: employee.full_name,
        first_name: employee.first_name,
        last_name: employee.last_name,
        gender: employee.gender,
        date_of_birth: employee.date_of_birth,
        maternal_status: employee.maternal_status,
        nationality: employee.nationality,
        email: employee.email,
        phone_number: employee.phone_number,
        alternative_phone_number: employee.alternative_phone_number,
        permanent_address: employee.permanent_address,
        current_address: employee.current_address,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        zip_code: employee.zip_code,
        contact_person_name: employee.contact_person_name,
        contact_person_relationship: employee.contact_person_relationship,
        contact_person_phone: employee.contact_person_phone,
        contact_person_alternative_phone: employee.contact_person_alternative_phone,
        contact_person_address: employee.contact_person_address,
        employee_code: employee.employee_code,
        job_title: employee.job_title,
        department: employee.department?.id || '',
        employee_type: employee.employee_type,
        employment_shift: employee.employment_shift,
        employment_status: employee.employment_status,
        hire_date: employee.hire_date,
        work_location: employee.work_location?.id || '',
        bank_account_number: employee.bank_account_number,
        basic_salary: employee.basic_salary,
        allowance: employee.allowance?.map(a => a.id) || [],
        effective_date: employee.effective_date,
        currency_of_salary: employee.currency_of_salary,
        cv_file: employee.cv_file,
        is_active: employee.is_active,
        deduction: employee.deduction?.map(d => d.id) || [],
      });
    }
  };

  const handleSave = async () => {
    if (!formData || !id) return;
    
    try {
      console.log('Sending update data:', formData);
      await updateEmployeeMutation.mutateAsync({ id, employee: formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleInputChange = (field: keyof UpdateEmployeeRequest, value: string | number | boolean) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  console.log('Employee detail state:', { loading, error, employee, formData });

  if (loading) {
    return <DataLoading />
  }

  if (error) {
    return <div className="p-6">Error: {error.message}</div>
  }

  if (!employee) {
    return <div className="p-6">Employee not found</div>
  }

  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 mb-10 px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/employee")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl text-primary font-title">Employee Details</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleCancel}
                disabled={updateEmployeeMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleSave}
                disabled={updateEmployeeMutation.isPending}
              >
                {updateEmployeeMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Employee Information */}
      <div className="px-6 space-y-6">
        {/* Personal Information Card */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Full Name</label>
              <Input 
                value={formData?.full_name || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
              />
            </div>
            {/* <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Last Name</label>
              <Input value={employee.full_name} className="bg-gray-50 border-gray-200" readOnly />
            </div> */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Nationality</label>
              <Input 
                value={formData?.nationality || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Country</label>
              <Input 
                value={formData?.country || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">City</label>
              <Input 
                value={formData?.city || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">State/Region</label>
              <Input 
                value={formData?.state || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 mb-2 block">Permanent Address</label>
              <Input 
                value={formData?.permanent_address || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('permanent_address', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 mb-2 block">Current Address</label>
              <Input 
                value={formData?.current_address || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('current_address', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.email || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Postal Code</label>
              <Input 
                value={formData?.zip_code || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.phone_number || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Alternative Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.alternative_phone_number || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('alternative_phone_number', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.date_of_birth || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Gender</label>
              <Input 
                value={formData?.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Maternal Status</label>
              <Input 
                value={formData?.maternal_status ? formData.maternal_status.charAt(0).toUpperCase() + formData.maternal_status.slice(1) : ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('maternal_status', e.target.value)}
              />
            </div>
          </div>
          
          {/* CV File Section */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">CV File</label>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{employee.cv_file || 'No CV file uploaded'}</p>
                  {/* <p className="text-sm text-gray-500">{employee.cv_size} • Uploaded {employee.cv_upload_date}</p> */}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="w-10 h-10 p-0 bg-primary hover:bg-primary/80">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Information Card */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-600" />
            Employment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Status</label>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    employee.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    employee.is_active ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  {employee.is_active ? 'Active' : 'Inactive'}
                </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Employment Type</label>
              <Input 
                value={formData?.employee_type || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('employee_type', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Hire Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.hire_date || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('hire_date', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Employee Code</label>
              <Input 
                value={formData?.employee_code || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('employee_code', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Job Title</label>
              <Input 
                value={formData?.job_title || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Department</label>
              {isEditing ? (
                <Select
                  value={formData?.department || employee.department?.id}
                  onValueChange={(value: string) =>
                    setFormData(prev => prev ? { ...prev, department: value } : null)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className="!h-12">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
              <Input 
                value={employee.department?.name || 'N/A'} 
                className="bg-gray-50 border-gray-200" 
                readOnly 
              />
              )}
            </div>
            {/* <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Work Location</label>
              <Input 
                value={employee.work_location?.branch_name || 'N/A'} 
                className="bg-gray-50 border-gray-200" 
                readOnly 
              />
            </div> */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Work Location
              </label>

              {isEditing ? (
                <Select
                value={formData?.work_location || employee.work_location?.id} // pre-select current location
                onValueChange={(value: string) =>
                  setFormData(prev => prev ? { ...prev, work_location: value } : null)
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="!h-12">
                  <SelectValue placeholder="Select work location" />
                </SelectTrigger>
                <SelectContent>
                  {companyAddresses.map((companyAddress) => (
                    <SelectItem key={companyAddress.id} value={companyAddress.id}>
                      {companyAddress.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              ) : (
                <Input
                  value={employee.work_location?.branch_name || "N/A"}
                  className="bg-gray-50 border-gray-200"
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Employment Status</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.employment_status || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('employment_status', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Emergency Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={formData?.contact_person_phone || ''} 
                  className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('contact_person_phone', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Emergency Contact Name</label>
              <Input 
                value={formData?.contact_person_name || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Relationship</label>
              <Input 
                value={formData?.contact_person_relationship || ''} 
                className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('contact_person_relationship', e.target.value)}
              />
            </div>
          </div>

          {/* Compensation Details Sub-section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Compensation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Basic Salary</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    value={formData?.basic_salary?.toString() || ''} 
                    className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('basic_salary', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Currency</label>
                <Input 
                  value={formData?.currency_of_salary || ''} 
                  className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('currency_of_salary', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Effective Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    value={formData?.effective_date || ''} 
                    className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('effective_date', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Employment Shift</label>
                <Input 
                  value={formData?.employment_shift || ''} 
                  className={isEditing ? "border-gray-300" : "bg-gray-50 border-gray-200"} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('employment_shift', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Bank Account Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    value={formData?.bank_account_number || ''} 
                    className={isEditing ? "border-gray-300 pl-10" : "bg-gray-50 border-gray-200 pl-10"} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Allowances Section */}
        {employee.allowance && employee.allowance.length > 0 && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Allowances
            </h2>
            <div className="space-y-4">
              {employee.allowance.map((allowance) => (
                <div key={allowance.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Name</label>
                      <p className="text-gray-800">{allowance.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Type</label>
                      <p className="text-gray-800">{allowance.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Amount</label>
                      <p className="text-gray-800">{allowance.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Percentage</label>
                      <p className="text-gray-800">{allowance.percentage}%</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Description</label>
                      <p className="text-gray-800">{allowance.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deductions Section */}
        {/* {employee.deduction && employee.deduction.length > 0 && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              Deductions
            </h2>
            <div className="space-y-4">
              {employee.deduction.map((deduction) => (
                <div key={deduction.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Name</label>
                      <p className="text-gray-800">{deduction.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Category</label>
                      <p className="text-gray-800">{deduction.category.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Type</label>
                      <p className="text-gray-800">{deduction.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Amount</label>
                      <p className="text-gray-800">{deduction.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Percentage</label>
                      <p className="text-gray-800">{deduction.percentage}%</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Description</label>
                      <p className="text-gray-800">{deduction.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
} 