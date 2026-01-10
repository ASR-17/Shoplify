import {
  DollarSign,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";

const ExpenseSummaryCards = ({
  todayTotal = 0,
  weekTotal = 0,
  monthTotal = 0,
}) => {
  const cards = [
    {
      title: "Today's Expenses",
      value: todayTotal,
      icon: Calendar,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
    },
    {
      title: "This Week",
      value: weekTotal,
      icon: CalendarDays,
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary",
    },
    {
      title: "This Month",
      value: monthTotal,
      icon: CalendarRange,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`glass-card border border-white/10 rounded-2xl p-6 bg-gradient-to-br ${card.gradient}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-xl ${card.iconBg} border border-white/10`}
            >
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm mb-1">
            {card.title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            ₹{Number(card.value).toLocaleString("en-IN")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExpenseSummaryCards;
