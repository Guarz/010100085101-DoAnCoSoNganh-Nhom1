import axios from "./axios";

export const getOrders = () => {
    return axios.get("/admin/orders");
};

export const updateOrderStatus = (id, data) => {
    return axios.put(`/admin/orders/${id}/status`, data);
};
