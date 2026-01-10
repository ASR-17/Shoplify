import { Routes, Route } from "react-router-dom";
import InventoryList from "@/pages/inventory/InventoryList";
import AddProduct from "@/pages/inventory/AddProduct";
import EditProduct from "@/pages/inventory/EditProduct";

const InventoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<InventoryList />} />
      <Route path="add" element={<AddProduct />} />
      <Route path="edit/:id" element={<EditProduct />} />
    </Routes>
  );
};

export default InventoryRoutes;
