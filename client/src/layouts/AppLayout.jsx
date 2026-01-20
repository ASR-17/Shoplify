import Navbar from "@/components/common/Navbar";
import Starfield from "@/components/Starfield";
import { useAuth } from "@/context/AuthContext";
import { memo, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background (LOCKED) */}
      <FrozenStarfield />

      {/* ✅ Desktop/Tablet Navbar (FIXED LEFT stays same) */}
      <div className="hidden md:block">
        <Navbar isAuthenticated={isAuthenticated} user={user} />
      </div>

      {/* ✅ Mobile: hamburger button */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[1100] p-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-white"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ✅ Mobile Drawer + Overlay */}
      <div className="md:hidden">
        {/* overlay */}
        <div
          onClick={() => setMobileNavOpen(false)}
          className={`fixed inset-0 z-[1090] bg-black/60 transition-opacity duration-200 ${
            mobileNavOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* drawer */}
        <div
          className={`fixed top-0 left-0 z-[1095] h-full w-[82%] max-w-[320px]
            transition-transform duration-300 ease-out
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Drawer shell (this isolates desktop fixed sidebar styles) */}
          <div className="h-full bg-black/40 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
            {/* close button */}
            <div className="sticky top-0 z-10 flex items-center justify-end p-3 bg-black/30 backdrop-blur-xl border-b border-white/10">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keep your existing Navbar UI */}
            <Navbar isAuthenticated={isAuthenticated} user={user} />
          </div>
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
        onClick={() => mobileNavOpen && setMobileNavOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
