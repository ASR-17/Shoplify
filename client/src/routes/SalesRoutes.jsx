import { Routes, Route } from "react-router-dom";
import AddSale from "@/pages/sales/AddSale";
import SalesList from "@/pages/sales/SalesList";
import EditSale from "@/pages/sales/EditSale";

const SalesRoutes = () => (
  <Routes>
    <Route path="add" element={<AddSale />} />
    <Route path="records" element={<SalesList />} />
    <Route path="edit/:id" element={<EditSale />} />
  </Routes>
);

export default SalesRoutes;
