import API from "@/services/api";

/* GET ALL PRODUCTS */
export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data.data;
};

/* GET SINGLE PRODUCT */
export const getProductById = async (id) => {
  const products = await getProducts();
  return products.find((p) => p._id === id);
};

/* ADD PRODUCT */
export const createProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data.product;
};

/* UPDATE PRODUCT */
export const updateProduct = async (id, data) => {
  const res = await API.put(`/products/${id}`, data);
  return res.data.product;
};

/* UPDATE STOCK */
export const updateStock = ({ productId, adjustment }) =>
  API.patch(`/products/${productId}/quantity`, {
    adjustment: Number(adjustment),
  });

  