import {
  Edit2,
  Trash2,
  Package,
  Home,
  Users,
  Zap,
  MoreHorizontal,
  ArrowUpDown,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpenseImageModal from "./ExpenseImageModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const categoryIcons = {
  "Stock Purchase": Package,
  Rent: Home,
  Salary: Users,
  Electricity: Zap,
  Miscellaneous: MoreHorizontal,
};

const ExpenseTable = ({
  expenses = [],
  isAdmin,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return sortDirection === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  if (!expenses.length) {
    return (
      <div className="glass-card border border-white/10 rounded-2xl p-12 text-center">
        <div className="p-4 rounded-full bg-white/5 inline-block mb-4">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Expenses Found
        </h3>
        <p className="text-muted-foreground">
          Start adding expenses to see them here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              {["date", "category", "amount"].map((field) => (
                <TableHead
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-2 capitalize">
                    {field}
                    <ArrowUpDown className="w-4 h-4" />
                  </span>
                </TableHead>
              ))}
              <TableHead>Description</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Receipt</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedExpenses.map((expense) => {
              const Icon = categoryIcons[expense.category] || MoreHorizontal;

              return (
                <TableRow
                  key={expense._id || expense.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      {expense.category}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        expense.addedBy === "Admin"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {expense.addedBy}
                    </span>
                  </TableCell>
                  <TableCell>
                    {expense.receiptUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedImage(expense.receiptUrl)}
                      >
                        <FileImage className="w-4 h-4 text-primary" />
                      </Button>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(expense)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(expense._id || expense.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-between px-6 py-4 border-t border-white/10">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ExpenseImageModal
  open={!!selectedImage}
  imageUrl={selectedImage}
  onClose={() => setSelectedImage(null)}
/>

    </>
  );
};

export default ExpenseTable;
