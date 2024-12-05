import axiosInstance from "@/hooks/axios";

export const getProduct = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(`/products`, { params: filters });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const getOrders = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(`/orders`, { params: filters });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getUsers = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(`/users`, { params: filters });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
