import axios from "axios";

let utga: any = false;
const axiosInstance = axios.create({
  baseURL:
    utga === true
      ? "http://localhost:8080/api"
      : "http://178.128.98.157:8080/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token: any = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
