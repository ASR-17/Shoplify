import {
  Printer,
  Download,
  Share2,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InvoicePreview = ({
  invoice,
  shopDetails,
  isOpen,
  onClose,
  onPrint,
  onDownload,
  onShare,
}) => {
  if (!invoice) return null;

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const tax = 0;
  const grandTotal = subtotal + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-muted p-0 overflow-hidden">
  {/* ✅ Required for accessibility */}
  <DialogTitle className="sr-only">Invoice Preview</DialogTitle>

  {/* ================= ACTION BAR ================= */}
  <div className="flex justify-end gap-2 p-4 border-b bg-card">
    <Button size="sm" variant="outline" onClick={onPrint}>
      <Printer className="w-4 h-4 mr-1" /> Print
    </Button>

    <Button size="sm" variant="outline" onClick={onDownload}>
      <Download className="w-4 h-4 mr-1" /> PDF
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Share2 className="w-4 h-4 mr-1" /> Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onShare("whatsapp")}>
          📱 WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onShare("email")}>
          📧 Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* ================= INVOICE PAGE ================= */}
  <div
    id="invoice-print"
    className="bg-white text-gray-900 p-10 w-[794px] mx-auto"
  >
    {/* ================= HEADER ================= */}
    <div className="flex justify-between items-start border-b pb-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
          <Building2 className="text-white w-7 h-7" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{shopDetails.name}</h1>
          <p className="text-sm text-gray-600">{shopDetails.address}</p>
          <p className="text-sm text-gray-600">
            {shopDetails.phone} · {shopDetails.email}
          </p>
          {shopDetails.gstNumber && (
            <p className="text-xs text-gray-500">
              GSTIN: {shopDetails.gstNumber}
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <h2 className="text-3xl font-bold text-gray-300">INVOICE</h2>
        <p className="font-mono font-semibold mt-2">{invoice.invoiceNumber}</p>
        <p className="text-sm text-gray-500">
          Date: {new Date(invoice.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    {/* ================= CUSTOMER ================= */}
    <div className="mb-6">
      <p className="text-xs uppercase tracking-wider text-gray-500">Bill To</p>
      <p className="text-lg font-semibold">
        {invoice.customerName || "Walk-in Customer"}
      </p>
    </div>

    {/* ================= ITEMS TABLE ================= */}
    <table className="w-full border border-gray-200 mb-6">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left text-sm">Item</th>
          <th className="p-3 text-center text-sm">Qty</th>
          <th className="p-3 text-right text-sm">Rate</th>
          <th className="p-3 text-right text-sm">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item, idx) => (
          <tr key={idx} className="border-t">
            <td className="p-3">{item.productName}</td>
            <td className="p-3 text-center">{item.quantity}</td>
            <td className="p-3 text-right">₹{item.pricePerItem}</td>
            <td className="p-3 text-right font-medium">₹{item.total}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* ================= TOTALS ================= */}
    <div className="flex justify-end">
      <div className="w-72 border p-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-sm mb-2">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
    </div>

    {/* ================= FOOTER ================= */}
    <div className="mt-10 border-t pt-4 text-center text-sm text-gray-500">
      <p>Payment Method: {invoice.paymentType.toUpperCase()}</p>
      <p className="mt-1">
        This is a computer-generated invoice. No signature required.
      </p>
    </div>
  </div>
</DialogContent>

    </Dialog>
  );
};

export default InvoicePreview;
