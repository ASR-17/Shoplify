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
  ClipboardList,
  Receipt,
  Bell, // ✅ ADD
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

  // 🔔 TEMP (replace with NotificationContext later)
  const unreadCount = 3;

  const isActive = (path) => location.pathname === path;
  const isDashboardActive = location.pathname === "/dashboard";
  const isSalesActive = location.pathname.startsWith("/sales");
  const isInventoryActive = location.pathname.startsWith("/inventory");
  const isExpensesActive = location.pathname.startsWith("/expenses");
  const isInvoicesActive = location.pathname.startsWith("/invoices");
  const isReportsActive = location.pathname.startsWith("/reports");
  const isNotificationsActive = location.pathname.startsWith("/notifications");

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
      className="fixed left-0 top-0 h-full w-24 md:w-28 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col justify-between py-5 z-[999]"
    >
      {/* ================= TOP ================= */}
      <div className="flex flex-col items-center gap-2">
        {/* Home */}
        <NavIcon to="/home" active={isActive("/home")} icon={Home} label="Home" />

        {/* Dashboard */}
        <NavIcon
          to="/dashboard"
          active={isDashboardActive}
          icon={BarChart3}
          label="Analytics"
        />

        {/* Sales */}
        <NavDropdown
          open={salesOpen}
          setOpen={setSalesOpen}
          active={isSalesActive}
          icon={ShoppingCart}
          label="Sales"
        >
          <DropdownLink to="/sales/add" icon={ShoppingCart} label="Add Sale" />
          <DropdownLink to="/sales/records" icon={FileText} label="Records" />
        </NavDropdown>

        {/* Inventory */}
        <NavDropdown
          open={inventoryOpen}
          setOpen={setInventoryOpen}
          active={isInventoryActive}
          icon={Package}
          label="Inventory"
        >
          <DropdownLink to="/inventory" icon={FileText} label="Products" />
          <DropdownLink to="/inventory/add" icon={Package} label="Add Product" />
        </NavDropdown>

        {/* Expenses */}
        <NavDropdown
          open={expensesOpen}
          setOpen={setExpensesOpen}
          active={isExpensesActive}
          icon={Wallet}
          label="Expenses"
        >
          <DropdownLink to="/expenses" icon={FileText} label="Overview" />
          <DropdownLink to="/expenses/add" icon={Wallet} label="Add Expense" />
        </NavDropdown>

        {/* Invoices */}
        <NavIcon
          to="/invoices"
          active={isInvoicesActive}
          icon={Receipt}
          label="Invoices"
        />

        {/* Reports */}
        <NavIcon
          to="/reports"
          active={isReportsActive}
          icon={ClipboardList}
          label="Reports"
        />

        {/* 🔔 NOTIFICATIONS */}
        <Link
          to="/notifications"
          className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
            isNotificationsActive
              ? "bg-white/10 text-primary"
              : "text-white/70"
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] uppercase">Alerts</span>

          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="relative flex flex-col items-center gap-4">
        {!isAuthenticated ? (
          <NavIcon
            to="/login"
            active={isActive("/login")}
            icon={LogIn}
            label="Login"
            small
          />
        ) : (
          <>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-white/20 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <p className="text-[9px] truncate max-w-16">{user?.name}</p>
            </button>

            {profileOpen && (
              <div className="absolute bottom-24 left-24 w-44 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
                <DropdownLink to="/settings" icon={Settings} label="Settings" />
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

/* ================= HELPERS ================= */

const NavIcon = ({ to, active, icon: Icon, label, small }) => (
  <Link
    to={to}
    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
      active ? "bg-white/10 text-primary" : "text-white/70"
    }`}
  >
    <Icon className={small ? "w-4.5 h-4.5" : "w-5 h-5"} />
    <span className="text-[10px] uppercase">{label}</span>
  </Link>
);

const NavDropdown = ({ open, setOpen, active, icon: Icon, label, children }) => (
  <div className="relative">
    <button
      onClick={() => setOpen(!open)}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-white/10 ${
        active ? "bg-white/10 text-primary" : "text-white/70"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] uppercase flex items-center gap-1">
        {label}
        <ChevronDown
          className={`w-2.5 h-2.5 transition ${open ? "rotate-180" : ""}`}
        />
      </span>
    </button>

    {open && (
      <div className="absolute left-full top-0 ml-2 w-44 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
        {children}
      </div>
    )}
  </div>
);

const DropdownLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
  >
    <Icon className="w-4 h-4" />
    {label}
  </Link>
);

export default Navbar;
