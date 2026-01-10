import SalesTable from "@/components/sales/SalesTable";
import AppLayout from "@/layouts/AppLayout";

const SalesList = () => {
  return (
    <AppLayout>
      <SalesTable isAdmin />
    </AppLayout>
  );
};

export default SalesList;
