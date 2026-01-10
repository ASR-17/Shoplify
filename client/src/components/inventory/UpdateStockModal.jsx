import { useState } from "react";
import { Plus, Minus, Package } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const reasons = [
  { value: "new_stock", label: "New Stock Arrival" },
  { value: "manual_correction", label: "Manual Correction" },
  { value: "damaged", label: "Damaged / Expired" },
  { value: "returned", label: "Customer Return" },
  { value: "other", label: "Other" },
];

const UpdateStockModal = ({ open, onOpenChange, product, onSave }) => {
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState("");

  const newQuantity = (product?.quantity || 0) + adjustment;

  const handleSave = () => {
    if (!product || !reason) return;

    onSave({
      productId: product.id,
      adjustment,
      reason,
    });

    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setAdjustment(0);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Update Stock
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="text-foreground font-medium">{product?.name}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Current Stock:{" "}
              <span className="text-primary font-semibold">
                {product?.quantity}
              </span>
            </p>
          </div>

          {/* Adjustment Controls */}
          <div className="space-y-2">
            <Label className="text-foreground">Adjust Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white/5 border-white/20 hover:bg-destructive/20 hover:border-destructive/30"
                onClick={() => setAdjustment((a) => a - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                value={adjustment}
                onChange={(e) =>
                  setAdjustment(parseInt(e.target.value, 10) || 0)
                }
                className="w-24 text-center bg-white/5 border-white/20 text-foreground"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white/5 border-white/20 hover:bg-green-500/20 hover:border-green-500/30"
                onClick={() => setAdjustment((a) => a + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* New Quantity Preview */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">New Quantity</span>
              <span
                className={`text-2xl font-bold ${
                  newQuantity < 0 ? "text-destructive" : "text-primary"
                }`}
              >
                {newQuantity}
              </span>
            </div>
          </div>

          {/* Reason Select */}
          <div className="space-y-2">
            <Label className="text-foreground">Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-white/5 border-white/20 text-foreground">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/20">
                {reasons.map((r) => (
                  <SelectItem
                    key={r.value}
                    value={r.value}
                    className="text-foreground hover:bg-white/10"
                  >
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/5 border-white/20 text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!reason || newQuantity < 0}
            className="bg-primary hover:bg-primary/80"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStockModal;
