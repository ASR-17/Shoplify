import {
  FileText,
  Printer,
  Download,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InvoicesTable = ({
  invoices,
  onView,
  onPrint,
  onDownload,
  onShare,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPaymentBadgeStyle = (type) => {
    switch (type) {
      case "cash":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "upi":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "card":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!invoices || invoices.length === 0) {
    return (
      <div className="glass-card border border-white/10 rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No Invoices Found
        </h3>
        <p className="text-muted-foreground text-sm">
          No invoices match your current filters. Try adjusting your date range
          or payment type.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Invoice #
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Customer
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                Payment
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice, index) => (
              <tr
                key={invoice.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  index % 2 === 0
                    ? "bg-transparent"
                    : "bg-white/[0.02]"
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-mono text-sm text-foreground">
                      {invoice.invoiceNumber}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 text-sm text-foreground">
                  {invoice.customerName || (
                    <span className="text-muted-foreground italic">
                      Walk-in
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <span className="font-semibold text-foreground">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Badge
                    className={`${getPaymentBadgeStyle(
                      invoice.paymentType
                    )} border`}
                  >
                    {invoice.paymentType.toUpperCase()}
                  </Badge>
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      onClick={() => onView(invoice)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      onClick={() => onPrint(invoice)}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      onClick={() => onDownload(invoice)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onShare(invoice)}
                        >
                          <span className="text-green-500 mr-2">
                            📱
                          </span>
                          Share via WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onShare(invoice)}
                        >
                          <span className="mr-2">📧</span>
                          Share via Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden divide-y divide-white/5">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Date: {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Badge
                className={`${getPaymentBadgeStyle(
                  invoice.paymentType
                )} border`}
              >
                {invoice.paymentType.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {invoice.customerName || (
                  <span className="italic">
                    Walk-in Customer
                  </span>
                )}
              </span>
              <span className="font-semibold text-lg text-foreground">
                ₹{invoice.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 text-xs border-white/10"
                onClick={() => onView(invoice)}
              >
                <Eye className="w-3.5 h-3.5 mr-1" /> View
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 border-white/10"
                onClick={() => onPrint(invoice)}
              >
                <Printer className="w-3.5 h-3.5" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 border-white/10"
                onClick={() => onDownload(invoice)}
              >
                <Download className="w-3.5 h-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 border-white/10"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onShare(invoice)}
                  >
                    <span className="text-green-500 mr-2">
                      📱
                    </span>
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onShare(invoice)}
                  >
                    <span className="mr-2">📧</span>
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-white/10"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-8 border-white/10"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesTable;
