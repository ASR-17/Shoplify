import { Link } from "react-router-dom";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/layouts/AppLayout";

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {!isAuthenticated ? (
            /* Logged-out State */
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                  Welcome to Shopify
                </h1>
                <p className="text-white/60 text-lg">
                  Smart Inventory, Sales & Analytics Management
                </p>
              </div>

              {/* Login Button */}
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="
                    flex items-center justify-center gap-2 px-6 py-3 rounded-md
                    bg-primary/20 hover:bg-primary/30 border border-primary/50
                    text-white backdrop-blur-sm transition-all duration-300
                    hover:scale-105 hover:shadow-[0_0_20px_rgba(100,200,255,0.3)]
                  "
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </div>
            </div>
          ) : (
            /* Logged-in State */
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center space-y-6 animate-fade-in">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1 shadow-[0_0_30px_rgba(100,200,255,0.3)]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3 text-white/70">
                <p className="text-lg font-semibold text-white">
                  {user?.name}
                </p>
                <p className="text-sm uppercase tracking-wide">
                  {user?.role}
                </p>
              </div>

              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
