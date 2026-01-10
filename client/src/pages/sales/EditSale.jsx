import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SaleForm from "@/components/sales/SaleForm";
import AppLayout from "@/layouts/AppLayout";
import { getSaleById, updateSale } from "@/services/sale.service";
import { useToast } from "@/hooks/use-toast";

const EditSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await getSaleById(id);
        const sale = res.data.sale;

        setFormData({
          product: sale.productName,
          quantity: sale.quantity,
          pricePerItem: sale.pricePerItem,
          customerName: sale.customerName || "",
          paymentType: sale.paymentType,
        });
      } catch (err) {
        toast({ title: "Failed to load sale", variant: "destructive" });
        navigate("/sales/records");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateSale(id, {
      productName: formData.product,
      quantity: Number(formData.quantity),
      pricePerItem: Number(formData.pricePerItem),
      customerName: formData.customerName,
      paymentType: formData.paymentType,
    });

    toast({ title: "Sale updated successfully" });
    navigate("/sales/records");
  };

  if (loading || !formData) {
    return (
      <AppLayout>
        <div className="text-white text-center mt-20">Loading sale...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SaleForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Update Sale"
      />
    </AppLayout>
  );
};

export default EditSale;
