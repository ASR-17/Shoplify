import Navbar from "@/components/common/Navbar";
import Starfield from "@/components/Starfield";
import { useAuth } from "@/context/AuthContext";
import { memo, useEffect, useState } from "react";
import { Menu } from "lucide-react";

/* 🔒 Freeze Starfield */
const FrozenStarfield = memo(Starfield);

const AppLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close drawer on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll when drawer open (mobile)
  useEffect(() => {
    if (mobileNavOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background (LOCKED) */}
      <FrozenStarfield />

      {/* ✅ Desktop/Tablet Navbar (unchanged) */}
      <div className="hidden md:block">
        <Navbar isAuthenticated={isAuthenticated} user={user} />
      </div>

      {/* ✅ Mobile: hamburger button */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[1001] p-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-white"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ✅ Mobile Drawer + Overlay */}
      <div className="md:hidden">
        {/* overlay */}
        <div
          onClick={() => setMobileNavOpen(false)}
          className={`fixed inset-0 z-[1000] bg-black/60 transition-opacity duration-200 ${
            mobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* drawer */}
        <div
          className={`fixed top-0 left-0 h-full z-[1001] transition-transform duration-300 ease-out ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* keep your same navbar UI */}
          <Navbar isAuthenticated={isAuthenticated} user={user} />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`
          relative z-10 min-h-screen
          px-6 py-8 md:px-12 md:py-14
          ml-0 md:ml-20 lg:ml-24
          text-white font-semibold
        `}
        // click anywhere in content closes mobile drawer
        onClick={() => mobileNavOpen && setMobileNavOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
