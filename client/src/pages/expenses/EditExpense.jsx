import { useState, useEffect } from "react";
import {
  Wallet,
  Save,
  ArrowLeft,
  Calendar,
  FileText,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import AppLayout from "@/layouts/AppLayout";

const categories = [
  { value: "Stock Purchase", label: "Stock Purchase" },
  { value: "Rent", label: "Rent" },
  { value: "Salary", label: "Salary" },
  { value: "Electricity", label: "Electricity" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];


// Mock data (replace with API later)
const mockExpenses = [
  {
    id: "1",
    date: "2026-01-05",
    category: "stock-purchase",
    amount: 25000,
    description: "Monthly inventory restock",
    receiptImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
  },
  {
    id: "2",
    date: "2026-01-04",
    category: "electricity",
    amount: 3500,
    description: "Monthly electricity bill",
  },
  {
    id: "3",
    date: "2026-01-03",
    category: "salary",
    amount: 45000,
    description: "Staff salary - December",
    receiptImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
  },
  {
    id: "4",
    date: "2026-01-02",
    category: "rent",
    amount: 15000,
    description: "Shop rent - January",
  },
  {
    id: "5",
    date: "2026-01-01",
    category: "miscellaneous",
    amount: 2500,
    description: "Office supplies",
  },
];

const EditExpense = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
    receiptImage: undefined,
  });

  useEffect(() => {
    // Simulate fetch
    const timer = setTimeout(() => {
      const expense = mockExpenses.find((e) => e.id === id);

      if (expense) {
        setFormData({
          category: expense.category,
          amount: expense.amount.toString(),
          description: expense.description,
          date: expense.date,
          receiptImage: expense.receiptImage,
        });
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Expense Updated",
      description: "The expense has been updated successfully.",
    });

    navigate("/expenses");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">
            Loading expense data...
          </p>
        </div>
      </div>
    );
  }

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
              Edit Expense
            </h1>
          </div>
          <p className="text-muted-foreground">
            Update expense record details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="glass-card border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
            {/* Date Display */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 rounded-lg px-4 py-3 border border-white/10">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {new Date(formData.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs ml-auto opacity-60">
                (Read-only)
              </span>
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
                  {categories.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
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
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />
            </div>

            {/* Receipt */}
            <div className="space-y-2">
              <Label>Receipt / Bill Image</Label>
              <ReceiptUpload
                value={formData.receiptImage}
                onChange={(value) =>
                  setFormData({ ...formData, receiptImage: value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Update Expense
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/expenses")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </form>

        {/* Admin Notice */}
        <div className="mt-6 p-4 border border-dashed border-primary/30 rounded-xl bg-primary/5">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Only administrators can edit expense records
          </p>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default EditExpense;
