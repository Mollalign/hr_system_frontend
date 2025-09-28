import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Home,
  MapPin,
  Menu,
  Settings,
  Users,
  X,
  DollarSign,
  CreditCard,
  CalendarCheck
} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Department",
      path: "/department",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      name: "Employee",
      path: "/employee",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Company Address",
      path: "/company-address",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      name: "Salary Structure",
      path: "/salary-structure",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      name: "Payroll",
      path: "/payroll",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Setting",
      path: "/setting",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    const currentPathSegments = location.pathname.split("/").filter(Boolean);
    const menuPathSegments = path.split("/").filter(Boolean);
    return currentPathSegments[0] === menuPathSegments[0];
  };

  return (
    <div
      className={`bg-gradient-to-b from-[#0D47A1] via-[#1976D2] to-[#42A5F5] text-white transition-all duration-300 h-full shadow-lg ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!isCollapsed && (
          <h1 className="text-xl font-bold tracking-wide">HR System</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 hidden lg:block"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="mt-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={onMobileClose}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-white/20 text-white font-medium shadow-sm"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
