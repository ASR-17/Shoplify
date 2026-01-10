import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ExpenseImageModal = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-white/20 max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-foreground">
            Receipt Image
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="flex items-center justify-center p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Expense Receipt"
              className="max-h-[70vh] w-auto rounded-lg object-contain border border-white/10"
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              No image available
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseImageModal;
