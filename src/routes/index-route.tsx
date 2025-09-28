import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy load all page components for better performance
const DashboardLayout = lazy(() => import("../components/layouts"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const DepartmentPage = lazy(() => import("../pages/department/Department"));
const EmployeePage = lazy(() => import("../pages/employee/employee-list"));
const EmployeeDetail = lazy(() => import("../pages/employee/employee-detail"))
const CompanyAddressPage = lazy(() => import("../pages/companyAddress/CompanyAddress"));
const SalaryStructureList = lazy(() => import("../pages/salary-structure/salary-structure-list"));
const AttendanceList = lazy(() => import("../pages/attendance/attendace-list"))
const PayrollList = lazy(() => import("../pages/payroll/payroll-list").then(module => ({ default: module.PayrollList })));
const SettingPage = lazy(() => import("../pages/setting/Setting"));


// Export individual routes without the dashboard wrapper
export const dashboardRoutes = (
  <>
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="department" element={<DepartmentPage />}/>
      <Route path="employee" element={<EmployeePage />} />
      <Route path="employee/:id" element={<EmployeeDetail />}/>
      <Route path="company-address" element={<CompanyAddressPage />}/>
      <Route path="salary-structure" element={<SalaryStructureList />} />
      <Route path="attendance" element={<AttendanceList />} />
      <Route path="payroll" element={<PayrollList />} />
      <Route path="setting" element={<SettingPage />}/>
    </Route>
  </>
)