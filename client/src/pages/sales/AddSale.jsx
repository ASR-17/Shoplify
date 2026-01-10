import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SaleForm from "@/components/sales/SaleForm";
import { createSale } from "@/services/sale.service";
import AppLayout from "@/layouts/AppLayout";

const AddSale = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productId: "",        // ✅ CHANGED
    quantity: "",
    pricePerItem: "",
    customerName: "",
    paymentType: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSale({
        productId: formData.productId,          // ✅ REQUIRED
        quantity: Number(formData.quantity),
        pricePerItem: Number(formData.pricePerItem),
        customerName: formData.customerName,
        paymentType: formData.paymentType,
      });

      toast({ title: "Sale added successfully" });

      setFormData({
        productId: "",
        quantity: "",
        pricePerItem: "",
        customerName: "",
        paymentType: "",
      });
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
