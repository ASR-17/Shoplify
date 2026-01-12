import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SaleForm from "@/components/sales/SaleForm";
import { createSale } from "@/services/sale.service";
import AppLayout from "@/layouts/AppLayout";

const AddSale = () => {
  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ routing

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    customerName: "",
    paymentType: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSale({
        productId: formData.productId,
        quantity: Number(formData.quantity),
        customerName: formData.customerName || "",
        paymentType: formData.paymentType,
      });

      toast({ title: "Sale added successfully" });

      // ✅ CLEAN REDIRECT (NO REFRESH HACKS)
      navigate("/sales/records");

    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to add sale",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <SaleForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Sale"
      />
    </AppLayout>
  );
};

export default AddSale;
