import React, { useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
import { User, ChevronDown, Home, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  // const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    // logout();
    setShowUserMenu(false);
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      return [{ name: "Dashboard", path: "/", isActive: true }];
    }

    const breadcrumbs = [];

    // Add Dashboard as first item
    breadcrumbs.push({
      name: "Dashboard",
      path: "/",
      isActive: pathSegments.length === 0,
    });

    // Build path progressively
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        name: displayName,
        path: currentPath,
        isActive: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile Menu Toggle and Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 max-w-4xl">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                {index > 0 && (
                  <span className="mx-1 sm:mx-2 text-gray-400">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}

                {breadcrumb.isActive ? (
                  <span className="text-sm sm:text-lg font-semibold text-indigo-700 truncate max-w-[120px] sm:max-w-none">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    to={breadcrumb.path}
                    className="flex items-center text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:underline transition-colors truncate max-w-[100px] sm:max-w-none"
                  >
                    {breadcrumb.path === "/" ? (
                      <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    ) : null}
                    {breadcrumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">Molle</p>
                <p className="text-xs text-gray-500">{"Admin"}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">
                    Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">
                    Help
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
