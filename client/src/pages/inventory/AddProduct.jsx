import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

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

import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/layouts/AppLayout";
import { createProduct } from "@/services/product.service";

const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Garden",
  "Sports",
  "Other",
];

const units = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "litre", label: "Litre" },
  { value: "box", label: "Box" },
  { value: "pack", label: "Pack" },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    unit: "",
    supplier: "",
    lowStockThreshold: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.costPrice ||
      !formData.sellingPrice ||
      !formData.quantity ||
      !formData.unit
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await createProduct({
        name: formData.name,
        category: formData.category,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        quantity: Number(formData.quantity),
        unit: formData.unit,
        supplier: formData.supplier,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      });

      toast({
        title: "Product Added",
        description: `${formData.name} added to inventory`,
      });

      navigate("/inventory");
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      category: "",
      costPrice: "",
      sellingPrice: "",
      quantity: "",
      unit: "",
      supplier: "",
      lowStockThreshold: "",
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Add Product
              </h1>
            </div>
            <p className="text-muted-foreground">
              Add a new product to your inventory
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="glass-card rounded-2xl p-6 space-y-6">

              {/* Name */}
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950/80 text-white border border-white/10 backdrop-blur-md">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Cost price"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Selling price"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: e.target.value })
                  }
                />
              </div>

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                <Select
                  value={formData.unit}
                  onValueChange={(v) =>
                    setFormData({ ...formData, unit: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier */}
              <Input
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
              />

              {/* Threshold */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  Low Stock Threshold
                </Label>
                <Input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    setFormData({ ...formData, lowStockThreshold: e.target.value })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            🔗 Auto stock deduction from sales is live 🔥
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddProduct;
