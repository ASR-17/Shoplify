import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Wallet, PiggyBank, FileText } from "lucide-react";

const reportTypes = [
  { id: "sales", label: "Sales Report", icon: TrendingUp },
  { id: "expense", label: "Expense Report", icon: Wallet },
  { id: "profit", label: "Profit Report", icon: PiggyBank },
  { id: "combined", label: "Combined Report", icon: FileText },
];

const ReportTypeSelector = ({ activeType, onTypeChange }) => {
  return (
    <div className="w-full">
      <Tabs
        value={activeType}
        onValueChange={onTypeChange}
        className="w-full"
      >
        <TabsList className="w-full h-auto p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl grid grid-cols-2 lg:grid-cols-4 gap-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 transition-all duration-300 hover:bg-white/5"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  {type.label}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ReportTypeSelector;
