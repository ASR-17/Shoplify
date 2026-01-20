import { useEffect, useMemo, useState } from "react";
import { Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts } from "@/services/product.service";

const paymentTypes = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

const SaleForm = ({
  formData = {},            // ✅ DEFAULT SAFETY
  setFormData,
  onSubmit,
  submitLabel,
}) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= TOTAL CALC ================= */
  const totalAmount = useMemo(() => {
    const qty = Number(formData.quantity || 0);
    const price = Number(formData.pricePerItem || 0);
    return (qty * price).toFixed(2);
  }, [formData.quantity, formData.pricePerItem]);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="glass-card border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">

        {/* ================= DATE ================= */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 rounded-lg px-4 py-3 border border-white/10">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{currentDate}</span>
        </div>

        {/* ================= PRODUCT ================= */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Product *
          </Label>

          <Select
            value={formData.productId ?? ""}
            onValueChange={(value) =>
              setFormData({ ...formData, productId: value })
            }
            disabled={loadingProducts}
          >
            <SelectTrigger className="bg-white/5 border-white/20">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>

            <SelectContent className="bg-gray/80 text-white border border-white/10 backdrop-blur-md">
              {products.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ================= QUANTITY + PRICE ================= */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="number"
            min="1"
            placeholder="Quantity"
            value={formData.quantity ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            required
          />

          <Input
            type="number"
            min="0"
            placeholder="Price per item"
            value={formData.pricePerItem ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, pricePerItem: e.target.value })
            }
            required
          />
        </div>

        {/* ================= TOTAL ================= */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex justify-between">
          <span>Total Amount</span>
          <span className="text-xl font-bold text-primary">
            ₹{totalAmount}
          </span>
        </div>

        {/* ================= CUSTOMER ================= */}
        <Input
          placeholder="Customer name (optional)"
          value={formData.customerName ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
        />

        {/* ================= PAYMENT TYPE ================= */}
        <Select
          value={formData.paymentType ?? ""}
          onValueChange={(value) =>
            setFormData({ ...formData, paymentType: value })
          }
        >
          <SelectTrigger className="bg-white/5 border-white/20">
            <SelectValue placeholder="Payment type" />
          </SelectTrigger>

          <SelectContent className="bg-gray/80 text-white border border-white/10 backdrop-blur-md">
            {paymentTypes.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ================= SUBMIT ================= */}
        <div className="flex justify-center pt-4">
          <Button type="submit" className="px-10">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SaleForm;
