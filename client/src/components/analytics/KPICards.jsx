import { IndianRupee, TrendingUp, ShoppingCart, Wallet } from "lucide-react";

const fmt = (v) =>
  v >= 100000
    ? `₹${(v / 100000).toFixed(1)}L`
    : `₹${v.toLocaleString("en-IN")}`;

const cards = (kpis) => [
  {
    label: "Total Revenue",
    value: fmt(kpis.totalRevenue),
    sub: "Last 12 months",
    icon: IndianRupee,
    color: "emerald",
  },
  {
    label: "Net Profit",
    value: fmt(kpis.totalProfit),
    sub: `${kpis.totalRevenue ? ((kpis.totalProfit / kpis.totalRevenue) * 100).toFixed(1) : 0}% margin`,
    icon: TrendingUp,
    color: kpis.totalProfit >= 0 ? "blue" : "red",
  },
  {
    label: "Total Expenses",
    value: fmt(kpis.totalExpenses),
    sub: "Operational costs",
    icon: Wallet,
    color: "rose",
  },
  {
    label: "Total Orders",
    value: kpis.totalOrders.toLocaleString(),
    sub: `~${Math.round(kpis.totalOrders / 12)}/month avg`,
    icon: ShoppingCart,
    color: "purple",
  },
];

const colorMap = {
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
  blue:    "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
  rose:    "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400",
  red:     "from-red-500/20 to-red-500/5 border-red-500/30 text-red-400",
  purple:  "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
};

const KPICards = ({ kpis }) => {
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(kpis).map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`rounded-2xl bg-gradient-to-br ${colorMap[c.color]} border p-5 flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
              <div className="p-2 rounded-lg bg-white/5">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;