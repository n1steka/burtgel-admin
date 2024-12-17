import axios from "axios";

let utga: any = false;
const axiosInstance = axios.create({
  baseURL:
    utga === true
      ? "http://localhost:8080/api"
      : "https://7fbd-66-181-176-234.ngrok-free.app/api",
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
