import { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DashboardFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    range: 'This Month', // ✅ IMPORTANT
    dateFrom: undefined,
    dateTo: undefined,
    paymentType: 'all',
    category: 'all',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newValues) => {
    const updated = { ...filters, ...newValues };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const clearFilters = () => {
    const reset = {
      range: 'This Month',
      dateFrom: undefined,
      dateTo: undefined,
      paymentType: 'all',
      category: 'all',
    };
    setFilters(reset);
    onFilterChange?.(reset);
  };

  const hasActiveFilters =
    filters.range !== 'This Month' ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.paymentType !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Filters</h3>
          {hasActiveFilters && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground md:hidden"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'grid gap-4 md:grid-cols-4',
          !isExpanded && 'hidden md:grid'
        )}
      >
        {/* From Date */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-muted/50 border-white/10',
                  !filters.dateFrom && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateFrom
                  ? format(filters.dateFrom, 'PPP')
                  : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) =>
                  updateFilters({ dateFrom: date, range: 'Custom' })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-muted/50 border-white/10',
                  !filters.dateTo && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateTo
                  ? format(filters.dateTo, 'PPP')
                  : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) =>
                  updateFilters({ dateTo: date, range: 'Custom' })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Payment Type (future use) */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Payment Type</Label>
          <Select
            value={filters.paymentType}
            onValueChange={(value) =>
              updateFilters({ paymentType: value })
            }
          >
            <SelectTrigger className="bg-muted/50 border-white/10">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category (future use) */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              updateFilters({ category: value })
            }
          >
            <SelectTrigger className="bg-muted/50 border-white/10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="stock">Stock Purchase</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
