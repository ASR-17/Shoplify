import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const InvoiceFilters = ({ onFiltersChange }) => {
  const [dateRange, setDateRange] = useState("timeline");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [paymentType, setPaymentType] = useState("all");
  const [isExpanded, setIsExpanded] = useState(true);

  /* 🔥 APPLY FILTERS IMMEDIATELY */
  useEffect(() => {
    onFiltersChange({
      dateRange,
      startDate,
      endDate,
      paymentType,
    });
  }, [dateRange, startDate, endDate, paymentType]);

  return (
    <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-medium">Filters</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* DATE RANGE */}
            <div>
              <label className="text-sm text-muted-foreground">Timeline</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeline">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CUSTOM DATES */}
            {dateRange === "custom" && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">From</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        {startDate ? format(startDate, "PP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">To</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        {endDate ? format(endDate, "PP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {/* PAYMENT */}
            <div>
              <label className="text-sm text-muted-foreground">Payment</label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;
