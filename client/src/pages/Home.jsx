import { Link } from "react-router-dom";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import AppLayout from "@/layouts/AppLayout";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { store, branding } = useSettings();

  // ✅ prevent blob URL errors after refresh
  const logoUrl =
    branding?.logoUrl && !branding.logoUrl.startsWith("blob:")
      ? branding.logoUrl
      : "";

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {!isAuthenticated ? (
            /* Logged-out State */
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                {/* ✅ Show store logo if available (only real URL) */}
                {logoUrl ? (
                  <div className="flex justify-center">
                    <img
                      src={logoUrl}
                      alt="Store logo"
                      className="h-16 w-16 object-contain rounded-xl border border-white/10 bg-white/5 p-2"
                    />
                  </div>
                ) : null}

                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                  {store?.storeName ? store.storeName : "Welcome to Shopify"}
                </h1>

                <p className="text-white/60 text-lg">
                  Smart Inventory, Sales & Analytics Management
                </p>

                {/* ✅ Optional footer text */}
                {branding?.invoiceFooterText ? (
                  <p className="text-white/50 text-sm">
                    {branding.invoiceFooterText}
                  </p>
                ) : null}
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
              {/* Avatar / Logo */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1 shadow-[0_0_30px_rgba(100,200,255,0.3)]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {/* ✅ Prefer store logo (only real URL) */}
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Store logo"
                        className="w-full h-full object-cover"
                      />
                    ) : user?.avatar ? (
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

              {/* ✅ Store + Admin Info */}
              <div className="space-y-2 text-white/70">
                <p className="text-lg font-semibold text-white">
                  {store?.storeName || "My Store"}
                </p>

                <p className="text-sm text-white/60">
                  Admin: <span className="text-white">{user?.name || "—"}</span>
                </p>

                <p className="text-sm uppercase tracking-wide">{user?.role}</p>

                {/* ✅ Optional store address */}
                {store?.storeAddress ? (
                  <p className="text-xs text-white/50">{store.storeAddress}</p>
                ) : null}
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
