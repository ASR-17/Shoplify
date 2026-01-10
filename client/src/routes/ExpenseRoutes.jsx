import { Routes, Route } from "react-router-dom";
import ExpensesSummary from "@/pages/expenses/ExpensesSummary";
import AddExpense from "@/pages/expenses/AddExpense";
import EditExpense from "@/pages/expenses/EditExpense";
import PrivateRoute from "@/components/auth/PrivateRoute";

const ExpenseRoutes = ({ isAdmin }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ExpensesSummary isAdmin={isAdmin} />
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
      {isAdmin && (
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditExpense />
            </PrivateRoute>
          }
        />
      )}
    </Routes>
  );
};

export default ExpenseRoutes;
