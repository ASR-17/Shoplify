import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ReportDataTable = ({
  data,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const SortableHeader = ({ column, children }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(column)}
      className="h-auto p-0 font-semibold text-white/70 hover:text-white hover:bg-transparent -ml-2"
    >
      {children}
      <ArrowUpDown
        className={`ml-1 h-3 w-3 ${
          sortColumn === column ? "text-primary" : ""
        }`}
      />
    </Button>
  );

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-24 bg-white/10" />
              <Skeleton className="h-8 flex-1 bg-white/10" />
              <Skeleton className="h-8 w-20 bg-white/10" />
              <Skeleton className="h-8 w-20 bg-white/10" />
              <Skeleton className="h-8 w-16 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!data.length) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
          <FileText className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No Data Found
        </h3>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          There are no transactions matching your current filters. Try adjusting
          your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">
                <SortableHeader column="date">Date</SortableHeader>
              </TableHead>
              <TableHead className="text-white/70">Description</TableHead>
              <TableHead className="text-white/70">
                <SortableHeader column="amount">Amount</SortableHeader>
              </TableHead>
              <TableHead className="text-white/70 hidden lg:table-cell">
                Payment Mode
              </TableHead>
              <TableHead className="text-white/70">Category</TableHead>
              <TableHead className="text-white/70 hidden xl:table-cell">
                Created By
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="border-white/10 hover:bg-white/5 transition-colors"
              >
                <TableCell className="text-white/80 font-medium">
                  {transaction.date}
                </TableCell>

                <TableCell className="text-white/70 max-w-[200px] truncate">
                  {transaction.description}
                </TableCell>

                <TableCell
                  className={`font-semibold ${
                    transaction.type === "sale"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {transaction.type === "sale" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  <Badge
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white/70"
                  >
                    {transaction.paymentMode}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${
                      transaction.type === "sale"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>

                <TableCell className="hidden xl:table-cell">
                  <span className="text-white/60">
                    {transaction.createdBy}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden divide-y divide-white/10">
        {data.map((transaction) => (
          <div key={transaction.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-medium">
                  {transaction.description}
                </p>
                <p className="text-white/50 text-sm">
                  {transaction.date}
                </p>
              </div>

              <p
                className={`font-bold ${
                  transaction.type === "sale"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {transaction.type === "sale" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-white/5 border-white/20 text-white/70 text-xs"
              >
                {transaction.paymentMode}
              </Badge>

              <Badge
                className={`text-xs ${
                  transaction.type === "sale"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                }`}
              >
                {transaction.category}
              </Badge>

              <span className="text-white/40 text-xs">
                by {transaction.createdBy}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <p className="text-white/50 text-sm">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDataTable;
