import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import {
  Package,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Users,
  FileText,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const icons = [
    { label: "Inventory", icon: Package },
    { label: "Sales", icon: TrendingUp },
    { label: "Analytics", icon: BarChart3 },
    { label: "Orders", icon: ShoppingCart },
    { label: "Customers", icon: Users },
    { label: "Reports", icon: FileText },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Starfield Background */}
      <Starfield />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 w-[80%] mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SHOPIFY
          </h1>
          <p className="text-lg md:text-xl text-slate-300/80 tracking-wide">
            Intelligent Inventory, Sales & Business Insights
          </p>
        </div>

        {/* Rotating Icons System */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-16">
          
          

          {/* Orbiting Icons */}
          <div className="absolute inset-0 animate-orbit-clockwise">
            {icons.map((item, index) => {
              const angle = (index * 60) * (Math.PI / 180);
              const radius = 125;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={item.label}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div className="animate-counter-rotate flex flex-col items-center group">
                    <div className="icon-glow glow-pulse w-16 h-16 md:w-18 md:h-18 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-white/70">
                      <item.icon className="w-6 h-6 md:w-9 md:h-9 text-white transition-colors duration-300" />
                    </div>
                    <span className="mt-2 text-[10px] md:text-xs text-white/60 tracking-wider uppercase">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Welcome Button */}
        <button
          onClick={() => navigate("/home")}
          className="px-10 py-4 border border-white/40 bg-transparent text-white tracking-widest uppercase text-sm font-medium rounded-sm transition-all duration-500 hover:border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-white/5"
        >
          Welcome Home
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 right-2 z-10">
        <p className="text-[12px] text-slate-500 tracking-wide text-right">
          © 2025 Smart Manager. All rights reserved.
          <br />
          Accorging to 2005 Digital Millennium Copyright Act.
        </p>
      </footer>
    </div>
  );
};

export default Index;
