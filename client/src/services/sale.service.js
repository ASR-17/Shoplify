import axios from "@/services/api";

export const getSales = () => axios.get("/sales");
export const getSaleById = (id) => axios.get(`/sales/${id}`);
export const createSale = (data) => axios.post("/sales", data);
export const updateSale = (id, data) => axios.put(`/sales/${id}`, data);
export const deleteSale = (id) => axios.delete(`/sales/${id}`);
