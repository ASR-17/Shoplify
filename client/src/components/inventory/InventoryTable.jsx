import {
  Edit2,
  PackagePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StockBadge from "./StockBadge";
import { cn } from "@/lib/utils";

const InventoryTable = ({
  products,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onUpdateStock,
  isAdmin,
}) => {
  return (
    <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">
                Product Name
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                Category
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">
                Quantity
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">
                Unit
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">
                Cost Price
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">
                Selling Price
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                Supplier
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">
                Status
              </TableHead>
              {isAdmin && (
                <TableHead className="text-muted-foreground font-semibold text-center">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length > 0 ? (
              products.map((product) => {
                const isLowStock =
                  product.quantity <= product.lowStockThreshold;

                return (
                  <TableRow
                    key={product._id}
                    className={cn(
                      "border-white/10 transition-colors",
                      isLowStock
                        ? "bg-yellow-500/5 hover:bg-yellow-500/10"
                        : "hover:bg-white/5"
                    )}
                  >
                    <TableCell className="text-foreground font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-foreground text-center font-semibold">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {product.unit}
                    </TableCell>
                    <TableCell className="text-foreground text-right">
                      ₹{product.costPrice}
                    </TableCell>
                    <TableCell className="text-primary font-semibold text-right">
                      ₹{product.sellingPrice}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {product.supplier}
                    </TableCell>
                    <TableCell className="text-center">
                      <StockBadge
                        quantity={product.quantity}
                        lowStockThreshold={product.lowStockThreshold}
                      />
                    </TableCell>

                    {isAdmin && (
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => onEdit(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-green-400 hover:bg-green-500/10"
                            onClick={() => onUpdateStock(product)}
                          >
                            <PackagePlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 9 : 8}
                  className="text-center py-12 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(
              currentPage * itemsPerPage,
              totalItems
            )}{" "}
            of {totalItems} products
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/5 border-white/20"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-foreground px-2">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/5 border-white/20"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
