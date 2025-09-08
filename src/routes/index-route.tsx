import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy load all page components for better performance
const DashboardLayout = lazy(() => import("../components/layouts"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const DepartmentPage = lazy(() => import("../pages/department/Department"));
const EmployeePage = lazy(() => import("../pages/employee/Employee"));
const CompanyAddressPage = lazy(() => import("../pages/companyAddress/CompanyAddress"));
const SettingPage = lazy(() => import("../pages/setting/Setting"));


// Export individual routes without the dashboard wrapper
export const dashboardRoutes = (
  <>
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="department" element={<DepartmentPage />}/>
      <Route path="employee" element={<EmployeePage />}/>
      <Route path="company-address" element={<CompanyAddressPage />}/>
      <Route path="setting" element={<SettingPage />}/>
    </Route>
  </>
)