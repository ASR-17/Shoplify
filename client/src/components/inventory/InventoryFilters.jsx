import { Search, Layers, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const InventoryFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  supplierFilter,
  onSupplierChange,
  lowStockOnly,
  onLowStockChange,
  categories,
  suppliers,
}) => {
  return (
    <div className="glass-card border border-white/10 rounded-2xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/20 text-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/20">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}

            </SelectContent>
          </Select>
        </div>

        {/* Supplier Filter */}
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-muted-foreground" />
          <Select value={supplierFilter} onValueChange={onSupplierChange}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/20 text-foreground">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/20">
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((sup) => (
                <SelectItem key={sup} value={sup}>
                  {sup}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Low Stock Toggle */}
        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
          <Switch
            id="low-stock"
            checked={lowStockOnly}
            onCheckedChange={onLowStockChange}
          />
          <Label
            htmlFor="low-stock"
            className="text-sm text-foreground cursor-pointer"
          >
            Low Stock Only
          </Label>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
