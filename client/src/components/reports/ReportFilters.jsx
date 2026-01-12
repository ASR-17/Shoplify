import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Filter, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ReportFilters = ({
  dateRange,
  onDateRangeChange,
  customDateFrom,
  customDateTo,
  onCustomDateFromChange,
  onCustomDateToChange,
  createdBy,
  onCreatedByChange,
  paymentMode,
  onPaymentModeChange,
  category,
  onCategoryChange,
  onApply,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-white/90 hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-medium">Filters</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs">Date Range</Label>
                <Select value={dateRange} onValueChange={onDateRangeChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {dateRange === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                            !customDateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateFrom
                            ? format(customDateFrom, "PPP")
                            : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customDateFrom}
                          onSelect={onCustomDateFromChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                            !customDateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateTo
                            ? format(customDateTo, "PPP")
                            : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customDateTo}
                          onSelect={onCustomDateToChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}

              {/* Created By */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs">Created By</Label>
                <Select value={createdBy} onValueChange={onCreatedByChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Mode */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs">Payment Mode</Label>
                <Select value={paymentMode} onValueChange={onPaymentModeChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="All Modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs">Category</Label>
                <Select value={category} onValueChange={onCategoryChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="stock-purchase">Stock Purchase</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={onClear}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>

              <Button
                onClick={onApply}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ReportFilters;
