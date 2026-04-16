import { useState, useEffect } from "react";
import {
  Wallet, Save, ArrowLeft, Calendar,
  FileText, DollarSign, Tag, Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ReceiptUpload from "@/components/expenses/ReceiptUpload";
import AppLayout from "@/layouts/AppLayout";
import expenseService from "@/services/expense.service";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { value: "Stock Purchase", label: "Stock Purchase" },
  { value: "Rent", label: "Rent" },
  { value: "Salary", label: "Salary" },
  { value: "Electricity", label: "Electricity" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];

const EditExpense = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
    receiptImage: undefined,
  });

  // ✅ FIX: only redirect when user is confirmed loaded (not null)
  useEffect(() => {
    if (user === null) return; // still loading auth
    if (user.role !== "admin") {
      toast({
        title: "Unauthorized",
        description: "Only admins can edit expenses",
        variant: "destructive",
      });
      navigate("/expenses");
    }
  }, [user]);

  // Fetch expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await expenseService.getExpenseById(id);
        const expense = res.data.data || res.data.expense || res.data;

        setFormData({
          category: expense.category || "",
          amount: expense.amount?.toString() || "",
          description: expense.description || "",
          date: expense.date || "",
          receiptImage: expense.receiptUrl || undefined,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load expense",
          variant: "destructive",
        });
        navigate("/expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

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
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("category", formData.category);
      payload.append("amount", formData.amount);
      payload.append("description", formData.description);
      payload.append("date", formData.date);

      if (formData.receiptImage instanceof File) {
        payload.append("receipt", formData.receiptImage);
      } else if (typeof formData.receiptImage === "string") {
        payload.append("existingReceipt", formData.receiptImage);
      }

      await expenseService.updateExpense(id, payload);

      toast({
        title: "Expense Updated",
        description: "The expense has been updated successfully.",
      });

      navigate("/expenses");
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update expense",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIX: loading state is INSIDE AppLayout so layout doesn't flash
  return (
    <AppLayout>
      <div className="min-h-screen p-6 md:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading expense data...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Edit Expense
                </h1>
              </div>
              <p className="text-muted-foreground">Update expense record details</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="glass-card border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">

                {/* Date display — ✅ FIX: UTC date parsing to avoid timezone shift */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString("en-US", {
                          weekday: "long", year: "numeric",
                          month: "long", day: "numeric",
                          timeZone: "UTC", // ✅ prevents day shift in IST
                        })
                      : "Date not available"}
                  </span>
                  <span className="text-xs ml-auto opacity-60">(Read-only)</span>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Description *
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Receipt / Bill Image</Label>
                  <ReceiptUpload
                    value={formData.receiptImage}
                    onChange={(value) => setFormData({ ...formData, receiptImage: value })}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Expense
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/expenses")}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>

              </div>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default EditExpense;