import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PaymentBadge from "./PaymentBadge";
import DeleteSaleModal from "./DeleteSaleModal";
import SalesFilters from "./SalesFilters";
import { useSales } from "@/hooks/useSales";

const SalesTable = ({ isAdmin }) => {
  const navigate = useNavigate();

  const {
    sales,
    searchQuery,
    setSearchQuery,
    paymentFilter,
    setPaymentFilter,
    deleteSale,
  } = useSales();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const itemsPerPage = 5;

  const filtered = sales.filter((s) => {
    const matchSearch =
      s.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customerName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchPayment =
      paymentFilter === "all" ||
      s.paymentType?.toLowerCase() === paymentFilter;

    return matchSearch && matchPayment;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");

  return (
    <>
      {/* Filters */}
      <SalesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
      />

      {/* Table */}
      <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead>Customer</TableHead>
              {isAdmin && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{formatDate(sale.createdAt)}</TableCell>
                  <TableCell className="font-medium">
                    {sale.productName}
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{sale.pricePerItem}
                  </TableCell>
                  <TableCell className="text-right text-primary font-semibold">
                    ₹{sale.totalAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    <PaymentBadge type={sale.paymentType} />
                  </TableCell>
                  <TableCell>
                    {sale.customerName || "—"}
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/sales/edit/${sale._id}`)
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSale(sale);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 8 : 7}
                  className="text-center py-12 text-white/50"
                >
                  No sales records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>

            <span className="text-sm text-white">
              {currentPage} / {totalPages}
            </span>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteSaleModal
        open={deleteOpen}
        sale={selectedSale}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (selectedSale?._id) {
            deleteSale(selectedSale._id);
          }
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

export default SalesTable;
