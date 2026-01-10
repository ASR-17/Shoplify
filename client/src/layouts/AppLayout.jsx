import Navbar from "@/components/common/Navbar";
import Starfield from "@/components/Starfield";
import { useAuth } from "@/context/AuthContext";
import { memo } from "react";

/* 🔒 Freeze Starfield */
const FrozenStarfield = memo(Starfield);

const AppLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background (LOCKED) */}
      <FrozenStarfield />

      {/* Fixed Navbar */}
      <Navbar isAuthenticated={isAuthenticated} user={user} />

      {/* Main Content */}
      <div
        className="
          relative z-10 min-h-screen
          px-10 py-10 md:px-12 md:py-14
          ml-0 md:ml-20 lg:ml-24
          text-white font-semibold
        "
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
