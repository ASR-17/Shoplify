import {
  Home,
  LogIn,
  User,
  Settings,
  LogOut,
  ShoppingCart,
  FileText,
  ChevronDown,
  Package,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = ({ isAuthenticated = false, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [expensesOpen, setExpensesOpen] = useState(false);

  const menuRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const isDashboardActive = location.pathname === "/dashboard";
  const isSalesActive = location.pathname.startsWith("/sales");
  const isInventoryActive = location.pathname.startsWith("/inventory");
  const isExpensesActive = location.pathname.startsWith("/expenses");

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
        setSalesOpen(false);
        setInventoryOpen(false);
        setExpensesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <nav
      ref={menuRef}
      className="fixed left-0 top-0 h-full w-24 md:w-28 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col justify-between py-6 z-[999]"
    >
      {/* ================= TOP ================= */}
      <div className="flex flex-col items-center gap-3">
        {/* Home */}
        <Link
          to="/home"
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
            isActive("/home")
              ? "bg-white/10 text-primary"
              : "text-white/70"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] uppercase">Home</span>
        </Link>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
            isDashboardActive
              ? "bg-white/10 text-primary"
              : "text-white/70"
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-[10px] uppercase">Analytics</span>
        </Link>

        {/* ================= SALES ================= */}
        <div className="relative">
          <button
            onClick={() => {
              setSalesOpen(!salesOpen);
              setInventoryOpen(false);
              setExpensesOpen(false);
            }}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
              isSalesActive
                ? "bg-white/10 text-primary"
                : "text-white/70"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[10px] uppercase flex items-center gap-1">
              Sales
              <ChevronDown
                className={`w-3 h-3 transition ${
                  salesOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {salesOpen && (
            <div className="absolute left-full top-0 ml-2 w-44 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <Link
                to="/sales/add"
                onClick={() => setSalesOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Sale
              </Link>
              <Link
                to="/sales/records"
                onClick={() => setSalesOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
              >
                <FileText className="w-4 h-4" />
                Records
              </Link>
            </div>
          )}
        </div>

        {/* ================= INVENTORY ================= */}
        <div className="relative">
          <button
            onClick={() => {
              setInventoryOpen(!inventoryOpen);
              setSalesOpen(false);
              setExpensesOpen(false);
            }}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
              isInventoryActive
                ? "bg-white/10 text-primary"
                : "text-white/70"
            }`}
          >
            <Package className="w-6 h-6" />
            <span className="text-[10px] uppercase flex items-center gap-1">
              Inventory
              <ChevronDown
                className={`w-3 h-3 transition ${
                  inventoryOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {inventoryOpen && (
            <div className="absolute left-full top-0 ml-2 w-44 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <Link
                to="/inventory"
                onClick={() => setInventoryOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
              >
                <FileText className="w-4 h-4" />
                Products
              </Link>
              <Link
                to="/inventory/add"
                onClick={() => setInventoryOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
              >
                <Package className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          )}
        </div>

        {/* ================= EXPENSES ================= */}
        <div className="relative">
          <button
            onClick={() => {
              setExpensesOpen(!expensesOpen);
              setSalesOpen(false);
              setInventoryOpen(false);
            }}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
              isExpensesActive
                ? "bg-white/10 text-primary"
                : "text-white/70"
            }`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] uppercase flex items-center gap-1">
              Expenses
              <ChevronDown
                className={`w-3 h-3 transition ${
                  expensesOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {expensesOpen && (
            <div className="absolute left-full top-0 ml-2 w-44 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <Link
                to="/expenses"
                onClick={() => setExpensesOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
              >
                <FileText className="w-4 h-4" />
                Overview
              </Link>
              <Link
                to="/expenses/add"
                onClick={() => setExpensesOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
              >
                <Wallet className="w-4 h-4" />
                Add Expense
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="relative flex flex-col items-center gap-4">
        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
              isActive("/login")
                ? "bg-white/10 text-primary"
                : "text-white/70"
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] uppercase">Login</span>
          </Link>
        ) : (
          <>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-white/20 overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <p className="text-[9px] truncate max-w-16">{user?.name}</p>
            </button>

            {profileOpen && (
              <div className="absolute bottom-24 left-24 w-44 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
