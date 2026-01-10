import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

// ✅ Sales, Inventory & Expenses Routes
import SalesRoutes from "./routes/SalesRoutes";
import InventoryRoutes from "./routes/InventoryRoutes";
import ExpenseRoutes from "./routes/ExpenseRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= MAIN ================= */}
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ================= FEATURES ================= */}
          <Route path="/sales/*" element={<SalesRoutes />} />
          <Route path="/inventory/*" element={<InventoryRoutes />} />
          <Route path="/expenses/*" element={<ExpenseRoutes />} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
