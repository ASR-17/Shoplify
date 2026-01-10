import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryTable from "@/components/inventory/InventoryTable";
import UpdateStockModal from "@/components/inventory/UpdateStockModal";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/layouts/AppLayout";
import { getProducts, updateStock } from "@/services/product.service";

const InventoryList = ({ isAdmin = true }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 10;

  /* 🔥 FETCH INVENTORY FROM BACKEND */
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await getProducts(); // ✅ already data
      setProducts(products);               // ✅ correct
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [toast]);


  /* 🔹 Dynamic filters */
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const suppliers = useMemo(
    () => [...new Set(products.map((p) => p.supplier).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesSupplier =
        supplierFilter === "all" || product.supplier === supplierFilter;

      const matchesLowStock =
        !lowStockOnly || product.quantity <= product.lowStockThreshold;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        matchesLowStock
      );
    });
  }, [
    products,
    searchQuery,
    categoryFilter,
    supplierFilter,
    lowStockOnly,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product) => {
    navigate(`/inventory/edit/${product._id}`);
  };

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setStockModalOpen(true);
  };

  /* 🔥 STOCK UPDATE */
  const handleStockSave = async ({ productId, adjustment }) => {
    try {
      await updateStock({ productId, adjustment, reason: "Manual adjustment" });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, quantity: p.quantity + adjustment }
            : p
        )
      );

      toast({
        title: "Stock Updated",
        description: `Stock adjusted by ${
          adjustment > 0 ? "+" : ""
        }${adjustment}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setStockModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Inventory Management
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your products and stock levels
              </p>
            </div>

            {isAdmin && (
              <Button onClick={() => navigate("/inventory/add")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>

          {/* Filters */}
          <InventoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            supplierFilter={supplierFilter}
            onSupplierChange={setSupplierFilter}
            lowStockOnly={lowStockOnly}
            onLowStockChange={setLowStockOnly}
            categories={categories}
            suppliers={suppliers}
          />

          {/* Table */}
          <InventoryTable
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onUpdateStock={handleUpdateStock}
            isAdmin={isAdmin}
          />

          {/* Update Stock Modal */}
          <UpdateStockModal
            open={stockModalOpen}
            onOpenChange={setStockModalOpen}
            product={
              selectedProduct
                ? {
                    id: selectedProduct._id,
                    name: selectedProduct.name,
                    quantity: selectedProduct.quantity,
                  }
                : undefined
            }
            onSave={handleStockSave}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default InventoryList;
