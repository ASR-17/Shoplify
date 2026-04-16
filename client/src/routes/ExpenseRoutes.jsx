import { Routes, Route } from "react-router-dom";
import ExpensesSummary from "@/pages/expenses/ExpensesSummary";
import AddExpense from "@/pages/expenses/AddExpense";
import EditExpense from "@/pages/expenses/EditExpense";
import PrivateRoute from "@/components/auth/PrivateRoute";

const ExpenseRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ExpensesSummary />
          </PrivateRoute>
        }
      />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <AddExpense />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <EditExpense />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ExpenseRoutes;