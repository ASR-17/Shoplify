import { useEffect, useState } from "react";
import { getSales, deleteSale as deleteSaleApi } from "@/services/sale.service";
import { useToast } from "@/hooks/use-toast";

export const useSales = () => {
  const { toast } = useToast();

  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await getSales();

      // ✅ GUARANTEE ARRAY
      const salesArray = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      setSales(salesArray);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load sales",
        variant: "destructive",
      });
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
    try {
      await deleteSaleApi(id);
      setSales((prev) => prev.filter((s) => s._id !== id));
      toast({ title: "Sale deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    searchQuery,
    setSearchQuery,
    paymentFilter,
    setPaymentFilter,
    deleteSale,
    refetch: fetchSales,
  };
};
