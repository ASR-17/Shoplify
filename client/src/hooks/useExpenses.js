import { useState, useEffect } from "react"; // ✅ MISSING IMPORT
import { getExpenses, getExpenseSummary } from "@/services/expense.service";

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const [expensesRes, summaryRes] = await Promise.all([
        getExpenses(),
        getExpenseSummary(),
      ]);

      setExpenses(expensesRes.data);
      setSummary(summaryRes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    summary,
    loading,
    error,
    refetch: fetchExpenses,
  };
};

export default useExpenses;
