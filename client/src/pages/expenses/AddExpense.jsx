import { useState } from "react";
import {
  Wallet,
  Save,
  RotateCcw,
  Calendar,
  FileText,
  DollarSign,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ReceiptUpload from "@/components/expenses/ReceiptUpload";
import * as expenseService from "@/services/expense.service";
import AppLayout from "@/layouts/AppLayout";

/**
 * ⚠ IMPORTANT
 * These values MUST match backend enum exactly
 */
const categories = [
  { value: "Stock Purchase", label: "Stock Purchase" },
  { value: "Rent", label: "Rent" },
  { value: "Salary", label: "Salary" },
  { value: "Electricity", label: "Electricity" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];


const AddExpense = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    receiptImage: null,
  });

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      /** ✅ MUST use FormData */
      const payload = new FormData();
      payload.append("category", formData.category);
      payload.append("amount", Number(formData.amount));
      payload.append("description", formData.description);

      /** ✅ REAL DATE (ISO) */
      payload.append(
        "date",
        new Date(formData.date).toISOString()
      );

      /** ✅ Receipt optional */
      if (formData.receiptImage) {
        payload.append("receipt", formData.receiptImage);
      }

      await expenseService.createExpense(payload);

      toast({
        title: "Success",
        description: "Expense added successfully",
      });

      navigate("/expenses");
    } catch (error) {
      console.error("ADD FAILED:", error);

      toast({
        title: "Failed to add expense",
        description:
          error?.response?.data?.message ||
          "Server error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      receiptImage: null,
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
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Add Expense
              </h1>
            </div>
            <p className="text-muted-foreground">
              Record a new shop expense
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="glass-card border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              {/* Date display */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{currentDate}</span>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}

                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Amount *
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Description *
                </Label>
                <Textarea
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              {/* Receipt */}
              <div className="space-y-2">
                <Label>Upload Receipt / Bill (Optional)</Label>
                <ReceiptUpload
                  value={formData.receiptImage}
                  onChange={(file) =>
                    setFormData({
                      ...formData,
                      receiptImage: file,
                    })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Expense
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddExpense;
