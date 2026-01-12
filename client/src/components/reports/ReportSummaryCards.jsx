import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PiggyBank,
  ReceiptText,
} from "lucide-react";

const ReportSummaryCards = ({ data, reportType }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      id: "sales",
      title: "Total Sales",
      value: data.totalSales,
      trend: data.salesTrend,
      icon: DollarSign,
      gradient: "from-emerald-500/20 to-green-600/20",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      show: ["sales", "combined", "profit"].includes(reportType),
    },
    {
      id: "expenses",
      title: "Total Expenses",
      value: data.totalExpenses,
      trend: data.expensesTrend,
      icon: Wallet,
      gradient: "from-rose-500/20 to-red-600/20",
      iconBg: "bg-rose-500/20",
      iconColor: "text-rose-400",
      borderColor: "border-rose-500/30",
      invertTrend: true,
      show: ["expense", "combined", "profit"].includes(reportType),
    },
    {
      id: "profit",
      title: "Net Profit",
      value: data.netProfit,
      trend: data.profitTrend,
      icon: PiggyBank,
      gradient:
        data.netProfit >= 0
          ? "from-blue-500/20 to-cyan-600/20"
          : "from-rose-500/20 to-red-600/20",
      iconBg:
        data.netProfit >= 0 ? "bg-blue-500/20" : "bg-rose-500/20",
      iconColor:
        data.netProfit >= 0 ? "text-blue-400" : "text-rose-400",
      borderColor:
        data.netProfit >= 0
          ? "border-blue-500/30"
          : "border-rose-500/30",
      show: ["profit", "combined"].includes(reportType),
    },
    {
      id: "transactions",
      title: "Transactions",
      value: data.transactionCount,
      icon: ReceiptText,
      gradient: "from-purple-500/20 to-violet-600/20",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      isCount: true,
      show: true,
    },
  ];

  const visibleCards = cards.filter((card) => card.show);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {visibleCards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.invertTrend
          ? (card.trend || 0) < 0
          : (card.trend || 0) > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <div
            key={card.id}
            className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} backdrop-blur-sm border ${card.borderColor} rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />

            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-white/60 text-sm font-medium">
                  {card.title}
                </p>

                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {card.isCount
                    ? data.transactionCount.toLocaleString()
                    : formatCurrency(card.value)}
                </p>

                {card.trend !== undefined && (
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      isPositive
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    <TrendIcon className="w-4 h-4" />
                    <span>{Math.abs(card.trend)}%</span>
                    <span className="text-white/50">
                      vs last period
                    </span>
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-xl ${card.iconBg}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportSummaryCards;
