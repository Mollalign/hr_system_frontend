import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { dashboardRoutes } from "./routes/index-route";
import { SimpleHRLoading } from "./components/layouts/loading";


// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<SimpleHRLoading />}>
      <Routes>

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>{dashboardRoutes}</Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}


// Root App Component
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  )
}

export default App