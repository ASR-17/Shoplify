import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SettingsProvider } from "./context/SettingsContext"; // ✅ ADD

/* ================= PUBLIC PAGES ================= */
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* ================= CORE PAGES ================= */
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

/* ================= FEATURE PAGES ================= */
import Reports from "./pages/reports";
import Invoices from "./pages/Invoices";
import Notifications from "./pages/Notifications";

/* ✅ ADD THIS */
import SettingsPage from "./pages/Settings";

/* ================= ROUTE GROUPS ================= */
import SalesRoutes from "./routes/SalesRoutes";
import InventoryRoutes from "./routes/InventoryRoutes";
import ExpenseRoutes from "./routes/ExpenseRoutes";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/sales/*" element={<SalesRoutes />} />
              <Route path="/inventory/*" element={<InventoryRoutes />} />
              <Route path="/expenses/*" element={<ExpenseRoutes />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* ✅ SETTINGS ROUTE */}
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="*" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
