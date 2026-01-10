import { useState, useMemo, useEffect } from "react";
import { Wallet, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import ExpenseSummaryCards from "@/components/expenses/ExpenseSummaryCards";
import CategoryBreakdown from "@/components/expenses/CategoryBreakdown";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import ExpenseTable from "@/components/expenses/ExpenseTable";

import AppLayout from "@/layouts/AppLayout";
import useExpenses from "@/hooks/useExpenses";
import { useAuth } from "@/context/AuthContext";
import expenseService from "@/services/expense.service";

const ExpensesSummary = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const { expenses = [], summary = {}, loading, refetch } = useExpenses();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  /* 🔄 Reset pagination on filters */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, dateRange]);

  /* 🔍 Filters (SAFE + TIMEZONE FIXED) */
  const filteredExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) return [];

    return expenses.filter((expense) => {
      if (!expense) return false;

      const matchesSearch =
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        expense.category === selectedCategory;

      let matchesDate = true;

      if (dateRange?.from) {
        const expenseDate = new Date(expense.date);
        expenseDate.setHours(0, 0, 0, 0);

        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = dateRange.to
          ? new Date(dateRange.to)
          : null;

        toDate?.setHours(23, 59, 59, 999);

        matchesDate =
          expenseDate >= fromDate &&
          (!toDate || expenseDate <= toDate);
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, searchQuery, selectedCategory, dateRange]);

  /* 📄 Pagination */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / itemsPerPage)
  );

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ✏️ Edit */
  const handleEdit = (expense) => {
    navigate(`/expenses/edit/${expense._id}`);
  };

  /* ❌ Delete */
  const handleDelete = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      toast({
        title: "Expense Deleted",
        description: "The expense has been removed successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  /* ⏳ Loading */
  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading expenses…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Expenses Overview
                </h1>
                <p className="text-muted-foreground">
                  Track and manage shop expenses
                </p>
              </div>
            </div>

            <Link to="/expenses/add">
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <ExpenseSummaryCards
            todayTotal={summary.todayTotal || 0}
            weekTotal={summary.weekTotal || 0}
            monthTotal={summary.monthTotal || 0}
          />

          {/* Category Breakdown */}
          <CategoryBreakdown data={summary.categoryBreakdown || []} />

          {/* Filters */}
          <ExpenseFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categories={[
              "Stock Purchase",
              "Rent",
              "Salary",
              "Electricity",
              "Miscellaneous",
            ]}
          />

          {/* Expense Table */}
          <ExpenseTable
            expenses={paginatedExpenses}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {!isAdmin && (
            <div className="glass-card border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4">
              <p className="text-sm text-yellow-200">
                💡 Employees can view and add expenses only.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ExpensesSummary;
