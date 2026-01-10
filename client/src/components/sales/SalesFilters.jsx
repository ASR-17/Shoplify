import { Search, CreditCard, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SalesFilters = ({
  searchQuery,
  setSearchQuery,
  paymentFilter,
  setPaymentFilter,
}) => {
  return (
    <div className="glass-card border border-white/10 rounded-2xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by product or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/20"
          />
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[150px] bg-white/5 border-white/20">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter Placeholder */}
        <Button
          variant="outline"
          className="bg-white/5 border-white/20 text-muted-foreground"
          disabled
        >
          <Calendar className="w-4 h-4 mr-2" />
          <Filter className="w-4 h-4 mr-1" />
          Date Range
        </Button>
      </div>
    </div>
  );
};

export default SalesFilters;
